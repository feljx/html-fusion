const { readFile, writeFile } = require('fs')
const { dirname, sep } = require('path')

const DEFAULT_LINEBREAK = process.platform === 'win32' ? '\r\n' : '\n'

function read_file (path) {
    return new Promise((resolve, reject) => {
        readFile(path, 'utf8', (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

async function process_file (path_in, path_out) {
    const curly_regex = /({{)([\s\S][^{{]+)(}})/g
    const insert_regex = /(?:(?:(\d)\s*\*\s*)?((?:\w|\/)+\.html))(\n|(?:\r\n))?/g
    try {
        let data = await read_file(path_in)
        let curly_match
        while ((curly_match = curly_regex.exec(data))) {
            const length = curly_match[0].length
            let inserts = curly_match[2]
            let insert_match
            while ((insert_match = insert_regex.exec(inserts))) {
                const length = insert_match[0].length
                const multiplier = Number(insert_match[1])
                const has_multiplier = !isNaN(multiplier)
                const html_path = dirname(path_in) + sep + insert_match[2]
                const linebreak_character = insert_match[3] || DEFAULT_LINEBREAK
                let html_data = await read_file(html_path)
                if (has_multiplier) {
                    let counter = multiplier
                    while (counter > 1) {
                        html_data += linebreak_character + html_data
                    }
                }
                const previous = inserts.slice(0, insert_match.index)
                const next = inserts.slice(insert_match.index + length)
                const possible_linebreak =
                    next.trim() === '' ? '' : linebreak_character
                inserts = previous + html_data + possible_linebreak + next
            }
            const previous = data.slice(0, curly_match.index)
            const next = data.slice(curly_match.index + length)
            data = previous + inserts + next
        }
        writeFile(path_out, data, {}, (err) => {
            if (err) throw err
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = { process_file }
