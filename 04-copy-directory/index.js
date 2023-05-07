
const fs = require('fs');
const path = require('path');

function copyDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
    if (err) throw err;
  });

  fs.readdir(path.join(__dirname, 'files'), (error, files) => {
    if(error) throw error;
    const ogFiles = [];
    files.forEach(file => {
      ogFiles.push(file);
      const src = path.join(__dirname, 'files', file);
      const dest = path.join(__dirname, 'files-copy', file);
      fs.copyFile(src, dest, error => {
        if(error) throw error;
      });
    })

    fs.readdir(path.join(__dirname, 'files-copy'), (error, files) => {
      if(error) throw error;
      files.forEach (file => {
        if (!ogFiles.includes(file)) {
          fs.unlink(path.join(__dirname, 'files-copy', file), error => {
            if(error) throw error;
          })
        }
      });
    });
  });
};

copyDir();