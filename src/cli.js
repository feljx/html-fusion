#!/usr/bin/env node

const { process_file } = require('./main.js')
const { extname } = require('path')
const chokidar = require('chokidar')
const { stat } = require('fs')

function has_html_format (arg) {
	return arg && extname(arg) === '.html'
}

function has_folder_format (arg) {
	return arg && extname(arg) === ''
}

async function initialize () {
	let path_in
	let path_out
	let path_watcher
	let is_output_arg = false
	let is_watcher_arg = false
	for (const arg of process.argv.slice(2)) {
		if (arg === '-o') {
			is_output_arg = true
		}
		else if (arg === '-w') {
			is_watcher_arg = true
		}
		else {
			if (is_watcher_arg) {
				if (!has_folder_format(arg)) {
					throw new Error(`Argument isn't a folder: "${arg}"`)
				}
				path_watcher = arg
				is_watcher_arg = false
			}
			else {
				if (!has_html_format(arg)) {
					throw new Error(`Argument isn't an HTML file: "${arg}"`)
				}
				if (is_output_arg) {
					path_out = arg
					is_output_arg = false
				}
				else {
					path_in = arg
				}
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
}

const paths = initialize()

process_file(paths[0], paths[1])
