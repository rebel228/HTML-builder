const { readdir, mkdir, writeFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const dest = path.join(__dirname, 'project-dist');
const htmlDest = path.join(__dirname, 'project-dist', 'index.html');
const cssDest = path.join(__dirname, 'project-dist', 'style.css');
const assetsDest = path.join(__dirname, 'project-dist', 'assets');

async function createDist () {
  await mkdir(dest, { recursive: true }, err => {
    if (err) throw err;
  });
  await writeFile(cssDest, '', error => {
    if(error) throw error;
  });
  await writeFile(htmlDest, '', error => {
    if(error) throw error;
  });
}

async function updateHtml () {
  let template = '';
  const files = await readdir(path.join(__dirname, 'components'), (error) => {
    if (error) throw error;
  });
  function saveToVariable (filePath) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath, 'utf-8');
      let result = '';
      stream.on('data', chunk => result += chunk);
      stream.on('end', () => resolve(result));
      stream.on('error', (error) => reject(error));
    });
  }
  async function updateTemplate () {
    for (const file of files) {
      let name = `${path.parse(file).name}`;
      let content = '';
      await saveToVariable(path.join(__dirname, 'components', file)).then( res => {
        content = res;
      });
      template = template.replace(`{{${name}}}`, content);
    }
  }
  async function replaceHtmlContent () {
    fs.appendFile(htmlDest, template, error => {
      if (error) throw error;
    });
  }
  await saveToVariable(path.join(__dirname, 'template.html')).then( res => {
    template = res;
  });
  await updateTemplate();
  replaceHtmlContent();
}

async function copyDir(srcPath, destPath) {
  await mkdir(destPath, { recursive: true }, err => {
    if (err) throw err;
  });

  fs.readdir((srcPath), (error, files) => {
    if(error) throw error;
    files.forEach(file => {
      const src = path.join(srcPath, file);
      const dest = path.join(destPath, file);
      fs.stat(src, (error, stats) => {
        if (error) throw error;
        if (stats.isDirectory()) {
          copyDir(src, dest);
        } else {
          fs.copyFile(src, dest, error => {
            if(error) throw error;
          });
        }
      });
    });
  });
}

function updateStyles () {
  fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
    if(error) throw error;

    files.forEach(file => {
      const src = path.join(__dirname, 'styles', file.name);
      const output = fs.createWriteStream(cssDest, { flags: 'a' });
      if(error) throw error;
      if (file.isFile() && path.extname(src) === '.css') {
        const input = fs.createReadStream(src, 'utf-8');

        pipeline (input, output, error => {
          if(error) throw error;
        });
      }
    });
  });
}

createDist();
updateHtml();
copyDir(path.join(__dirname, 'assets'), assetsDest);
updateStyles();