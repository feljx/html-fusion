#!/usr/bin/env node

const { process_file } = require('./main.js')
const { extname } = require('path')

function validate_arg (arg) {
	return arg && extname(arg) === '.html'
}

let path_in
let path_out
let is_output_arg = 0
for (const arg of process.argv.slice(2)) {
	if (arg === '-o') {
		is_output_arg ^= 1
	}
	else {
		if (!validate_arg(arg)) {
			throw new Error(`Incorrect argument: "${arg}"`)
		}
		if (is_output_arg) {
			path_out = arg
			is_output_arg ^= 1
		}
		else {
			path_in = arg
		}
	}
}
if (!(path_in && path_out)) {
	throw new Error('Insufficient arguments')
}

process_file(path_in, path_out)
