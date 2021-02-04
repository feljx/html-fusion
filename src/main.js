const { readFile, writeFile } = require('fs')
const { dirname, sep } = require('path')

const DEFAULT_LINEBREAK = process.platform === 'win32' ? '\r\n' : '\n'
const REGEX_CURLY = /({{)([\s\S][^{{]+)(}})/g
const REGEX_INSERT = /(\s*)(?:(?:(\d)\s*\*\s*)?((?:\w|\/)+\.html))(\n|(?:\r\n))?/g

function read_file (path) {
	return new Promise((resolve, reject) => {
		readFile(path, 'utf8', (err, data) => {
			if (err) reject(err)
			resolve(data)
		})
	})
}

// function really_normalize_path (path) {
// 	const
// }

async function EVOLVE (entry) {}

async function resolve (filepath) {
	let data = await read_file(filepath)
	let match_curly
	while ((match_curly = REGEX_CURLY.exec(data))) {
		const length = match_curly[0].length
		let inserts = match_curly[2]
		let match_insert
		while ((match_insert = REGEX_INSERT.exec(inserts))) {
			const length = match_insert[0].length
			const indent = match_insert[1]
			const multiplier = Number(match_insert[2])
			const has_multiplier = !isNaN(multiplier)
			const html_path = dirname(filepath) + sep + match_insert[3]
			const linebreak_character = match_insert[4] || DEFAULT_LINEBREAK
			console.log(filepath)
			console.log(html_path)
			let html_data = await resolve(html_path)
			if (has_multiplier) {
				let counter = multiplier
				while (counter > 1) {
					html_data += linebreak_character + html_data
				}
			}
			const previous = inserts.slice(0, match_insert.index)
			const next = inserts.slice(match_insert.index + length)
			const possible_linebreak = next.trim() === '' ? '' : linebreak_character
			inserts = previous + html_data + possible_linebreak + next
		}
		const previous = data.slice(0, match_curly.index)
		const next = data.slice(match_curly.index + length)
		data = previous + inserts + next
	}
	return data
}

async function create_output (path_in, path_out) {
	try {
		const data = await resolve(path_in)
		writeFile(path_out, data, {}, (err) => {
			if (err) throw err
		})
	} catch (error) {
		console.error(error)
	}
}

module.exports = { create_output }
