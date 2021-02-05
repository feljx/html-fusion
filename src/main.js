const { readFile, writeFile } = require('fs')
const { dirname } = require('path')
const replace_all = require('./replace_all')

const DEFAULT_LINEBREAK = process.platform === 'win32' ? '\r\n' : '\n'

function read_file (path) {
	return new Promise((resolve, reject) => {
		readFile(path, 'utf8', (err, data) => {
			if (err) reject(err)
			resolve(data)
		})
	})
}

function really_normalize_path (path) {
	const double_back = '\\\\'
	const single_back = '\\'
	const forward = '/'
	return replace_all(single_back, forward, replace_all(double_back, forward, path))
}

async function EVOLVE (entry) {
	entry = really_normalize_path(entry)
}

async function resolve (filepath) {
	const regex_curly = /({{)([\s\S][^{{]+)(}})/g
	const regex_insert = /(\s*)(?:(?:(\d)\s*\*\s*)?((?:\w|\/)+\.html))(\n|(?:\r\n))?/g
	filepath = really_normalize_path(filepath)
	let data = await read_file(filepath)
	let match_curly
	while ((match_curly = regex_curly.exec(data))) {
		const length = match_curly[0].length
		let inserts = match_curly[2]
		let match_insert
		while ((match_insert = regex_insert.exec(inserts))) {
			const length = match_insert[0].length
			const indent = match_insert[1]
			// const multiplier = Number(match_insert[2])
			// const has_multiplier = !isNaN(multiplier)
			const insert = match_insert[3]
			const insert_path = `${dirname(filepath)}/${insert}`
			const linebreak_character = match_insert[4] || DEFAULT_LINEBREAK

			// console.log('match_insert: ', match_insert)
			// console.log('filepath: ', filepath)
			// console.log('insert: ', insert)
			// console.log('insert_path: ', insert_path)

			let html_data = await resolve(insert_path)
			// html_data = html_data
			// 	.split(linebreak_character)
			// 	.map((elm, idx, arr) => {
			// 		if (idx === 0) return elm
			// 		if (idx === arr.length - 1) return indent + elm + linebreak_character
			// 		return indent + elm
			// 	})
			// 	.join(linebreak_character)

			// if (has_multiplier) {
			// 	let counter = multiplier
			// 	while (counter > 1) {
			// 		html_data += linebreak_character + html_data
			// 	}
			// }

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

module.exports = { create_output, resolve }
