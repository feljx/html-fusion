# html-fusion
Fuse multiple HTML files into one

## Installation
`npm i -D html-fusion`

## Usage
### Normal mode
`npx fusion <input_html> -o <output_html>`

### Watch mode (watch and fuse on file change)
`npx fusion <input_html> -o <output_html> -w <directory_to_watch>`

### Include other HTML files
Include HTML files by listing their filepaths relative to the HTML file from which they are included.
If you include an HTML file from the same folder, don't need to specify the folder, only the filename.

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

