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
For example, when including files from the same foler, you only need to specify a filename.

*Don't use absolute paths, they are not supported.*

```html
<body>
  <!-- Include multiple HTML files -->
  <!-- E.g. from a nested folder or from the same folder -->
  {{
  components/title.html
  components/nav.html
  button.html
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

