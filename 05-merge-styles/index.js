const { writeFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

async function updateStyles() {
  await writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', error => {
    if(error) throw error;
  });

  fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
    if(error) throw error;

    files.forEach(file => {
      const src = path.join(__dirname, 'styles', file.name);
      const dest = path.join(__dirname, 'project-dist', 'bundle.css');
      const output = fs.createWriteStream(dest, { flags: 'a' });
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

updateStyles();
