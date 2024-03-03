import express from 'express'
import { query } from './services/query.js'

const app = express()
app.use(express.json())

app.post('/ask', async (req, res) => {
    const { question } = req.body

    const answer = await query(question, 3)

    res.json({
        answer,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
