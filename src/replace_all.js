const replace_all = (a, b, s) => {
	while (s.includes(a)) {
		s = s.replace(a, b)
	}
	return s
}

module.exports = replace_all

// const path = '\\foo\\bar\\index.html'
// const abc = 'abc'
// const res_path = replace_all('\\', '/', path)
// const res_abc = replace_all('\\', '/', abc)
