import { config } from 'dotenv'
import { getEnv, validateEnvironmentVariables } from '../utils/util.js'
import { AppPinecone } from '../core/core.js'

config()
validateEnvironmentVariables()

export const deleteIndex = async () => {
    const indexName = getEnv('PINECONE_INDEX')

    const pinecone = new AppPinecone()

    const index = pinecone.index(indexName)

    try {
        await index.deleteAll()
        console.log(`Deleted all record of: ${indexName}`)
    } catch (e) {
        console.error(e?.toString())
    }
}
