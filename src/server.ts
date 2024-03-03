import express from 'express'
import { query } from './services/query.js'

const app = express()
app.use(express.json())

app.post('/ask', async (req, res) => {
    const { question, topK } = req.body

    const answer = await query(question, topK)

    res.json({
        answer,
    })
})

app.listen(3001, () => {
    console.log('Server is running')
})
