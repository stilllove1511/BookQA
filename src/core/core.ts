import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { validateEnvironmentVariables, getEnv } from "../utils/util.js";
config();

validateEnvironmentVariables();

const openAiApiKey = getEnv("OPENAI_API_KEY");

export class AppOpenAI extends OpenAI {
  constructor() {
    super({
      apiKey: openAiApiKey,
    });
  }
}

export class AppPinecone extends Pinecone {
  constructor() {
    super({
      apiKey: getEnv("PINECONE_API_KEY"),
    });
  }
}
