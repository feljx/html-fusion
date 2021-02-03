# html-fusion
Fuse multiple HTML files into one

## Installation
`npm i -D html-fusion`

## Usage
`npx fusion <input_html> -o <output_html>`
Watch for changes and fuse automatically
`npx fusion <input_html> -o <output_html> -w <directory_to_watch>`

### Include other HTML files
```html
<body>
  <!-- Include multiple HTML files (in same folder or in nested folders) -->
  {{
  components/title.html
  components/nav.html
  another_file.html
  }}
  
  <!-- Single HTML include -->
  {{ components/footer }}
</body>
```

### Example of an HTML include
```html
<!-- components/nav.html -->
<nav>
  <a>Content</a>
  <a>More stuff</a>
<nav>
```

`