#!/usr/bin/env node

const { process_file } = require('./main.js')
const { extname } = require('path')
const chokidar = require('chokidar')

function validate_arg (arg) {
	return arg && extname(arg) === '.html'
}

let path_in
let path_out
let path_watcher
let is_output_arg = false
let is_watcher_arg = false
for (const arg of process.argv.slice(2)) {
	if (arg === '-o') {
		is_output_arg = true
	}
	if (arg === '-w') {
		is_watcher_arg = true
	}
	else {
		if (!validate_arg(arg)) {
			throw new Error(`Incorrect argument: "${arg}"`)
		}
		if (is_output_arg) {
			path_out = arg
			is_output_arg = false
		}
		else if (is_watcher_arg) {
			path_watcher = arg
			is_watcher_arg = false
		}
		else {
			path_in = arg
		}
	}
}
if (!(path_in && path_out)) {
	throw new Error('Insufficient arguments')
}
if (path_watcher) {
	const watcher = chokidar.watch(path_watcher, {
		ignored: /(^|[\/\\])\../, // ignore dotfiles
		persistent: true
	})
	const changeEvents = [ 'add', 'change', 'unlink', 'addDir', 'unlinkDir' ]
	// on change
	for (const eventType of changeEvents) {
		watcher.on(eventType, () => process_file(path_in, path_out))
	}
}

process_file(path_in, path_out)
