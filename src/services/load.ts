import cliProgress from 'cli-progress'
import { config } from 'dotenv'

import { embedder } from './embeddings.js'

import { loadBook } from '../utils/bookLoader.js'
import { TextMetadata } from '../types/types.js'
import { validateEnvironmentVariables, getEnv } from '../utils/util.js'
import { AppPinecone } from '../core/core.js'

// Load environment variables from .env
config()

const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
)

let counter = 0

export const load = async (bookPath: string) => {
    validateEnvironmentVariables()

    // Get a Pinecone instance
    const pinecone = new AppPinecone()

    // Extract the selected column from the CSV file
    const documents = (await loadBook(bookPath)) as string[]

    // Get index name, cloud, and region
    const indexName = getEnv('PINECONE_INDEX')

    // Select the target Pinecone index. Passing the TextMetadata generic type parameter
    // allows typescript to know what shape to expect when interacting with a record's
    // metadata field without the need for additional type casting.
    const index = pinecone.index<TextMetadata>(indexName)

    // Start the progress bar
    progressBar.start(documents.length, 0)

    // Start the batch embedding process
    await embedder.init()
    await embedder.embedBatch(documents, 100, async (embeddings) => {
        counter += embeddings.length
        console.log(embeddings.length)
        // Whenever the batch embedding process returns a batch of embeddings, insert them into the index
        await index.upsert(embeddings)
        progressBar.update(counter)
    })

    progressBar.stop()
    console.log(
        `Inserted ${documents.length} documents into index ${indexName}`
    )
}
