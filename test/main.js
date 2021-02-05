const { test } = require('zora')
const replace_all = require('../src/replace_all')
const { resolve } = require('../src/main')
const { readFileSync } = require('fs')

const HTML_PATH = 'test/_index.html'
const REFERENCE_PATH = 'test/reference.html'

function minify_html (html) {
	html = replace_all(' ', '', html)
	html = replace_all('\r', '', html)
	html = replace_all('\n', '', html)
	return html
}

test('HTML resolution', async (t) => {
	const resolved = await resolve(HTML_PATH)
	const reference = readFileSync(REFERENCE_PATH, 'utf8')
	t.equal(
		minify_html(resolved),
		minify_html(reference),
		'resolve HTML and reference HTML should be the same'
	)
})
