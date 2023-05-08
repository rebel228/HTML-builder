const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), error => {
  if(error) console.log('Creating bundle for the first time');
});

fs.readdir(path.join(__dirname, 'styles'), (error, files) => {
  if(error) throw error;

  files.forEach(file => {
    const src = path.join(__dirname, 'styles', file);
    const dest = path.join(__dirname, 'project-dist', 'bundle.css');
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
