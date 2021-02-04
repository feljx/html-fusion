#!/usr/bin/env node

// console.log(process.argv)

// Imports
const { create_output } = require('./main.js')
const { extname } = require('path')
const chokidar = require('chokidar')

// Argument format predicates
const has_html_format = (arg) => arg && extname(arg) === '.html'
const has_folder_format = (arg) => arg && extname(arg) === ''

// Option, predicate couples
const [ arg_input, arg_output, arg_watch ] = [ '-i', '-o', '-w' ]
const option_predicates = {
	[arg_input]: has_html_format,
	[arg_output]: has_html_format,
	[arg_watch]: has_folder_format
}

// Build argument object out of raw argument array
const build_arg_object = (_args) => {
	const args = {}
	let idx = 2
	while (idx < _args.length) {
		if (idx % 2 === 0) {
			const [ option, arg ] = [ _args[idx], _args[idx + 1] ]
			if (!arg) {
				throw new Error(`No argument provided for option "${option}"`)
			}
			args[option] = arg
		}
		idx += 2
	}
	return args
}

// Verify argument object for correctness
const verify_arg_object = (args) => {
	for (const [ option, arg ] of Object.entries(args)) {
		const predicate = option_predicates[option]
		if (!predicate) {
			throw new Error(`Invalid option: "${option}"`)
		}
		if (!predicate(arg)) {
			throw new Error(`Invalid argument for option "${option}": "${arg}"`)
		}
	}
}

try {
	// Build argument object
	const args = build_arg_object(process.argv)
	// Verify argument object, throw if not correct
	verify_arg_object(args)
	// Arguments
	const path_in = args[arg_input]
	const path_out = args[arg_output]
	const path_watch = args[arg_watch]

	// Require at least input and output paths
	if (!(path_in && path_out)) {
		throw new Error('Insufficient arguments')
	}

	// If watcher path given, watch that directory for changes
	if (path_watch) {
		const watcher = chokidar.watch(path_watch, {
			ignored: /(^|[\/\\])\../, // ignore dotfiles
			persistent: true
		})
		const changeEvents = [ 'add', 'change', 'unlink', 'addDir', 'unlinkDir' ]
		// On change, recreate the HTML output
		for (const eventType of changeEvents) {
			watcher.on(eventType, () => create_output(path_in, path_out))
		}
	}

	// Create HTML output
	create_output(path_in, path_out)
} catch (error) {
	console.error(error)
}

// function initialize () {
// 	let path_in
// 	let path_out
// 	let path_watcher
// 	let is_output_arg = false
// 	let is_watcher_arg = false
// 	for (const arg of process.argv.slice(2)) {
// 		if (arg === '-o') {
// 			is_output_arg = true
// 		}
// 		else if (arg === '-w') {
// 			is_watcher_arg = true
// 		}
// 		else {
// 			if (is_watcher_arg) {
// 				if (!has_folder_format(arg)) {
// 					throw new Error(`Argument isn't a folder: "${arg}"`)
// 				}
// 				path_watcher = arg
// 				is_watcher_arg = false
// 			}
// 			else {
// 				if (!has_html_format(arg)) {
// 					throw new Error(`Argument isn't an HTML file: "${arg}"`)
// 				}
// 				if (is_output_arg) {
// 					path_out = arg
// 					is_output_arg = false
// 				}
// 				else {
// 					path_in = arg
// 				}
// 			}
// 		}
// 	}
// 	if (!(path_in && path_out)) {
// 		console.log(path_in, path_out)
// 		throw new Error('Insufficient arguments')
// 	}

// 	if (path_watcher) {
// 		const watcher = chokidar.watch(path_watcher, {
// 			ignored: /(^|[\/\\])\../, // ignore dotfiles
// 			persistent: true
// 		})
// 		const changeEvents = [ 'add', 'change', 'unlink', 'addDir', 'unlinkDir' ]
// 		// on change
// 		for (const eventType of changeEvents) {
// 			watcher.on(eventType, () => create_output(path_in, path_out))
// 		}
// 	}
// 	create_output(path_in, path_out)
// }

// initialize()
