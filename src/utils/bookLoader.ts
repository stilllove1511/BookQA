import fs from 'fs/promises'

export const loadBook = async (
    filePath = 'book.txt'
): Promise<string[] | void> => {
    try {
        // Get csv file absolute path
        const csvAbsolutePath = await fs.realpath(filePath)

        return fs
            .readFile(csvAbsolutePath, 'utf8')
            .then((data) => data.split('\n'))
            .then((data) => data.filter((line) => line.length >= 3))
    } catch (err) {
        console.error(err)
        throw err
    }
}
