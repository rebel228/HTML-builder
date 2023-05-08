const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err;
});
fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', error => {
  if(error) throw error;
});
fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '', error => {
  if(error) throw error;
});


async function updateHtml () {
  let template = '';
  const files = await readdir(path.join(__dirname, 'components'), (error, files) => {
    if (error) throw error;
  })
  function saveToVariable (filePath) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath, 'utf-8');
      let result = '';
      stream.on('data', chunk => result += chunk);
      stream.on('end', () => resolve(result));
      stream.on('error', (error) => reject(error))
    })
  }
  async function updateTemplate () {
    for (const file of files) {
      let name = `${path.parse(file).name}`;
      let content = '';
      await saveToVariable(path.join(__dirname, 'components', file)).then( res => {
        content = res;
      })
      template = template.replace(`{{${name}}}`, content);
    }
  }
  async function replaceHtmlContent () {
    fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), template, error => {
      if (error) throw error;
    });
  }
  await saveToVariable(path.join(__dirname, 'template.html')).then( res => {
    template = res;
  });
  await updateTemplate();
  replaceHtmlContent();
}

function copyDir(srcPath, destPath) {
  fs.mkdir(destPath, { recursive: true }, err => {
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
      })
    })
  });
};

fs.readdir(path.join(__dirname, 'styles'), (error, files) => {
  if(error) throw error;

  files.forEach(file => {
    const src = path.join(__dirname, 'styles', file);
    const dest = path.join(__dirname, 'project-dist', 'style.css');
    const output = fs.createWriteStream(dest, { flags: 'a' });
    fs.stat(src, (error, stats) => {
      if(error) throw error;
      if (stats.isFile() && path.parse(file).ext === '.css') {
        const input = fs.createReadStream(src, 'utf-8');

        pipeline (input, output, error => {
          if(error) throw error;
        })
      }
    })
  })
});

updateHtml();
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));