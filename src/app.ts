import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pinataRouter from "./routes/pinata";
import openAIRouter from "./routes/openAI";
import falAIRouter from "./routes/falAI";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/pinata", pinataRouter);
app.use("/openai", openAIRouter);
app.use("/falai", falAIRouter);

export default app;
