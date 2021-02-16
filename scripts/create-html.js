const marked = require('marked');
const ejs = require('ejs')
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
const fs = require('fs');
const path = require('path')
const grayMatter = require('gray-matter')

loadLanguages(['typescript', 'json']);

const renderer = {
  heading(text, level) {
    let name = `//apple_ref/cpp/Section/${'  '.repeat(level - 1)}${text}`
    if (text.endsWith('overview')) {
      name = `//apple_ref/cpp/Section/${text}`
    }


    return `
      <a name="${name}" class="dashAnchor">
        <h${level}>
          ${text}
        </h${level}>
      </a>
    `;
  }
}

marked.setOptions({
  highlight: function(code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

marked.use({renderer})

const templateString = fs.readFileSync(path.join(__dirname, 'template.ejs'), 'utf8');
const template = ejs.compile(templateString)
const modulesDirPath = path.join(__dirname, '../docs/modules')
const docFilenames = fs.readdirSync(modulesDirPath)

docFilenames.forEach(docFilename => {
  const docPath = path.join(__dirname, '../docs/modules', docFilename)
  const contents = marked.parse(grayMatter(fs.readFileSync(docPath, 'utf8')).content)
  const module = path.basename(docPath, '.md')
  const title = `Modules / ${module}`
  const outputPath = path.join(__dirname, `../fp-ts.docset/Contents/Resources/Documents/${module}.html`)
  const html = template({title, html: contents})

  fs.writeFileSync(outputPath, html)
})