import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { load } from "./services/load.js";
import { query as queryCommand } from "./services/query.js";
import { deleteIndex } from "./services/deleteIndex.js";

export const run = async () => {
  const parser = yargs(hideBin(process.argv))
    .scriptName("semanticSearchExample")
    .demandCommand(1)
    // Configure load command
    .command({
      command: "load",
      aliases: ["l"],
      describe: "Load the embeddings in to Pinecone",
      builder: (yargs) =>
        yargs
          .option("bookPath", {
            alias: "p",
            type: "string",
            description: "Path to your book path",
          })
          .option("column", {
            alias: "c",
            type: "string",
            description: "The name for the book column",
          }),
      handler: async (argv) => {
        const { bookPath } = argv;

        await load(bookPath);
      },
    })
    // Configure query command
    .command({
      command: "query",
      aliases: ["q"],
      describe: "Query Pinecone DB",
      builder: (yargs) =>
        yargs
          .option("query", {
            alias: "q",
            type: "string",
            description: "Your query",
            demandOption: true,
          })
          .option("topK", {
            alias: "k",
            type: "number",
            description: "number of results to return",
            demandOption: true,
          }),
      handler: async (argv) => {
        const { query, topK } = argv;
        if (!query) {
          console.error("Please provide a query");
          process.exit(1);
        }

        await queryCommand(query, topK);
      },
    })
    // Configure delete command
    .command({
      command: "delete",
      aliases: ["d"],
      describe: "Delete Pinecone Index",
      handler: async () => {
        await deleteIndex();
      },
    });

  // Parse query command
  return parser.parse();
};

run();
