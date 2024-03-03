import { config } from 'dotenv'
import { Pinecone } from '@pinecone-database/pinecone'
import { AppOpenAI } from '../core/core.js'
import { TextMetadata } from '../types/types.js'
import { validateEnvironmentVariables, getEnv } from '../utils/util.js'
import { embedder } from './embeddings.js'

config()
validateEnvironmentVariables()

export const query = async (query: string, topK: number) => {
    validateEnvironmentVariables()
    const pinecone = new Pinecone({
        apiKey: getEnv('PINECONE_API_KEY'),
    })

    // // Target the index
    const indexName = getEnv('PINECONE_INDEX')
    const index = pinecone.index<TextMetadata>(indexName)

    async function main() {
        const openai = new AppOpenAI()
        await embedder.init()

        // Embed the query
        const queryEmbedding = await embedder.embed(query)

        const results = await index.query({
            vector: queryEmbedding.values,
            topK,
            includeMetadata: true,
            includeValues: false,
        })

        //  Print the results
        console.log(
            results.matches?.map((match) => ({
                text: match.metadata?.text,
                score: match.score,
            }))
        )

        const introduction =
            'Use the below articles to answer the subsequent question. If the answer cannot be found in the articles, write "I could not find an answer."'
        const question = '\n\nQuestion: ' + query
        let message = introduction
        for (const match of results.matches) {
            const next_article =
                '\n\nArticle section:\n"""\n' + match.metadata?.text + '\n"""'
            message += next_article
        }
        message += question
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'gpt-3.5-turbo',
        })

        console.log(completion.choices[0])
    }

    main()
}
