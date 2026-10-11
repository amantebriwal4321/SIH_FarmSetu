# Demo script (about 3 minutes)

Record the screen with the app on localhost, no AWS credentials, then say clearly which calls are live and which are fallback. Do not claim a stack was deployed unless you have actually run `sam deploy` and can show the API Gateway URL responding.

## 0:00 About the project (30s)

Open `/`.

"A glut at the mandi becomes food waste. The price crashes, the farmer dumps the crop, and a processing unit a few kilometres away still has room. Kisan Setu scores that crash, routes the surplus to an SHG or FPO unit, and calls the farmer in their language."

Scroll until the tonne counter. "That tonne figure is computed from this demo's Kolar arrivals, above a normal early week. It is not a national statistic."

## 0:30 Stack and architecture (40s)

Stay on the README architecture diagram, or draw it while you talk.

"The app is one Next.js project. Risk scoring, matching, and the farmer registry run in TypeScript, so the demo works with no server and no keys. AWS is optional and each call is behind an env var."

Point at the diagram: browser, Next.js, Polly, DynamoDB, API Gateway, Lambda, Bedrock, and the local fallback.

## 1:10 How AWS is used (70s)

Open `/admin`.

"The score you see first is the in-app scorer: arrivals 45%, price slide 40%, harvest month 15%. Same function is packaged as a Lambda behind API Gateway. When `NEXT_PUBLIC_RISK_API_URL` is set, this panel POSTs the series and prints the Lambda score next to the local one."

If the URL is not set, read the panel out loud: "Set NEXT_PUBLIC_RISK_API_URL to score this series on AWS Lambda. I have not deployed that stack in this recording."

Click Explain. "This Hindi line is a template built from the score, the three signals, and the surplus tonnes. If `BEDROCK_MODEL_ID` is set, `/api/explain` asks Amazon Bedrock and labels the answer. If Bedrock fails, the template comes back."

Point at the catalog line. "Crops and units load from DynamoDB only when `DYNAMODB_TABLE_NAME` is set. Otherwise this is the static seed. The seed script writes that same seed into the table."

Open `/farmer`, switch to Hindi, press play.

"Hindi tries Amazon Polly, voice Kajal, hi-IN, through `/api/speak`. With no `AWS_REGION`, the route returns a fallback and the browser voice speaks. A real Polly clip labels itself Amazon Polly. Kannada and English never call Polly."

Click route surplus. "Kg kept out of waste is the share of this crop's surplus the units can take this week. Computed here, not a survey."

## 2:20 Learnings (40s)

"What I would tell a judge:"

- The scorer is small enough to run in the app and in Lambda. A local parity script checks they match. I did not need a model to score risk.
- Polly is the right service for a Hindi phone alert, but only after the voice and engine pair is right: Kajal is neural, Aditi is standard. The route falls back so a missing key does not blank the demo.
- DynamoDB is a catalog, not the whole product. The app still has to match distance and capacity itself.
- Bedrock is optional copy, not the decision. The numbers stay in our scorer so the model cannot invent a statistic.
- Shipping the fallback first meant the hackathon demo still runs on stage with no network to AWS.

End on `/flow` for five seconds so the loop (detect, route, call, confirm) is visible.
