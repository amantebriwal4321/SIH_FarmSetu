# Submission draft

WeMakeDevs AWS Environmental Hacks. Track: Waste and Energy.

Copy the sections below into the form. Do not add services that are not in this repo. This build was not deployed to AWS. Polly, API Gateway, Lambda invoke, DynamoDB, and Bedrock were not called against a live account here.

## Project title

Kisan Setu: route crop surplus before it becomes waste

## What it does

When a harvest glut crashes the mandi price, unsold crop is dumped. Kisan Setu scores crash risk from 0 to 100 using three signals (arrivals surge, price slide, harvest month), matches the surplus to nearby SHG and FPO processing units by distance and weekly capacity, and speaks an offer to the farmer in Hindi, Kannada, or English.

The officer console routes the surplus. A field partner portal covers farmers without smartphones. The farmer screen is the phone call: press 1 to accept.

Waste figures in the UI are computed from the demo's own Kolar arrivals series and the listed unit capacities. They are marked as such. The app does not claim a national food-waste statistic.

## How AWS is used

Implemented in this repo. Not deployed from this environment.

- **Amazon Polly.** `POST /api/speak` calls `SynthesizeSpeech` for Hindi (`hi-IN`). Default voice is Kajal with the neural engine. `POLLY_VOICE_ID=Aditi` switches to the standard engine. The route runs when `FARMSETU_AWS_REGION` is set, or `AWS_REGION` if the Farmsetu name is unset. On Vercel use `FARMSETU_AWS_REGION` plus `FARMSETU_AWS_ACCESS_KEY_ID` and `FARMSETU_AWS_SECRET_ACCESS_KEY`. Those two keys are passed to the SDK only when both are set. Otherwise, or if Polly errors, the response is JSON `{ fallback: true }` and the farmer screen uses the browser voice. Kannada and English do not call Polly.
- **AWS Lambda.** `aws/lambda/risk` scores a crop series with the same weights as `frontend/src/lib/engine/predictor.ts` (45% arrivals, 40% price, 15% season). `aws/scripts/check-risk-parity.mjs` checks the two copies locally. The handler accepts `POST` JSON `{ rows, harvestMonths }` and returns the latest score, label, and three signals. `GET /risk` returns a health JSON.
- **Amazon API Gateway.** `aws/template.yaml` defines an HTTP API (`AWS::Serverless::HttpApi`) with `POST /risk` and `GET /risk` on that Lambda, CORS open for browser calls. The stack output `RiskApiUrl` is what you set as `NEXT_PUBLIC_RISK_API_URL`. The officer console posts the series only when that variable is set. If the call fails, the in-app score stays on screen.
- **Amazon DynamoDB.** The same template creates a pay-per-request table, partition key `pk`, sort key `sk`. Crops are stored under `pk=CROP`, units under `pk=UNIT`. `frontend/scripts/seed-dynamodb.mts` (`npm run seed:dynamo`) writes the app's existing seed. `frontend/src/lib/aws/catalog.ts` queries the table when `DYNAMODB_TABLE_NAME` and `FARMSETU_AWS_REGION` (or `AWS_REGION`) are set. The same credential pair as Polly is passed when both key vars are set. Empty table, bad items, or any error falls back to the static seed.
- **Amazon Bedrock (optional).** `POST /api/explain` calls the Converse API when `BEDROCK_MODEL_ID` is set and a region is available (`BEDROCK_REGION`, else `FARMSETU_AWS_REGION`, else `AWS_REGION`). It asks for two Hindi sentences using only the score, label, signals, and surplus tonnes, with the same explicit credentials as Polly when both key vars are set. If the model id or region is unset, or the call fails, the route returns a Hindi template built from those same numbers. The model is not used to compute the score.

IAM for the Next.js server is in `aws/iam-app-policy.json`: `polly:SynthesizeSpeech`, DynamoDB `Query`, `BatchWriteItem`, and `PutItem` on `kisan-setu-catalog-*`, and `bedrock:InvokeModel` plus `bedrock:Converse`. The Lambda role from SAM is logs only. The function does not read DynamoDB.

## Team leader contributions

Solo build. Git history on this project is Aman Tebriwal.

He built the Next.js app: the crash-risk scorer, the unit matcher, the officer, field, and farmer screens, and the spoken alert. For this hackathon pass he added the Polly route, the Lambda and SAM template, the DynamoDB catalog with seed script and fallback, the optional Bedrock explanation, the waste framing computed from the demo series, and these docs.

## Feedback on the AWS services

Written from the code that is actually in the repo. Live calls were not made, so this is not a review of console latency or quotas.

What is solid in the design:

- Polly fits a short Hindi alert. Putting it behind `/api/speak` with a JSON fallback means a missing credential does not break the farmer screen. The voice and engine have to match: Kajal is neural, Aditi is standard. That split is easy to get wrong, so the route picks the engine from the voice id unless `POLLY_ENGINE` is set. Vercel reserves `AWS_REGION` and the standard key names and overwrites `AWS_REGION` at runtime, so Polly, DynamoDB, and Bedrock read `FARMSETU_AWS_REGION`, `FARMSETU_AWS_ACCESS_KEY_ID`, and `FARMSETU_AWS_SECRET_ACCESS_KEY` first and pass that key pair to the SDK when both keys are set. The standard names are only a fallback. That Vercel path has not been deployed from here.
- Lambda plus API Gateway is a good home for the scorer because the function is pure. The browser sends the series, the function returns a score. No database permission on the Lambda role. The rough part is keeping two copies of the math (TypeScript in the app, `score.mjs` in the Lambda). A local parity script is the check. It does not prove the deployed API.
- DynamoDB as a catalog is straightforward (one table, `pk`/`sk`, on-demand). The rough part is that the app's seed dates are generated from "today", so the seed script must be run from this repo rather than from a frozen JSON file, or the series will drift from the UI. The data access layer treats any failure as "use the static seed", which is what you want on stage and what hides a bad table name until you read the server log.
- Bedrock is the piece I would keep optional. It explains a score. It does not decide one. The prompt forbids extra statistics, and the fallback template uses only numbers the scorer already produced. Model access is account-specific, so a wrong `BEDROCK_MODEL_ID` must not take down the page. It does not.

What was not tested:

- `sam build` and `sam deploy` were not run (no AWS credentials in this environment).
- No Polly audio was synthesized. The farmer button's "Amazon Polly" label appears only after a real mp3 response.
- No request was sent to API Gateway.
- The DynamoDB seed script and the catalog reader were not run against a table.
- No Bedrock Converse call was made. The Hindi template path was the one exercised.

## Deploy checklist before you submit a live URL

1. `cd aws && sam build && sam deploy --guided`
2. Seed with `DYNAMODB_TABLE_NAME` set: `cd frontend && npm run seed:dynamo`
3. On Vercel set `FARMSETU_AWS_REGION`, `FARMSETU_AWS_ACCESS_KEY_ID`, `FARMSETU_AWS_SECRET_ACCESS_KEY`, `DYNAMODB_TABLE_NAME`, and `NEXT_PUBLIC_RISK_API_URL` (`RiskApiUrl`). Do not set `AWS_REGION` or the standard key names. Vercel reserves them and overwrites `AWS_REGION`.
4. Rebuild the Next.js app so the public URL is inlined.
5. On `/admin`, confirm the score panel says Amazon API Gateway + Lambda, and the catalog line says Amazon DynamoDB.
6. On `/farmer` in Hindi, confirm the clip is labeled Amazon Polly.
