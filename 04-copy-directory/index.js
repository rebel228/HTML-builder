
const { mkdir, rm } = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function copyDir() {
  await rm(path.join(__dirname, 'files-copy'), { recursive: true }), err => {
    if (err) throw err;
  };
  await mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
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
    });
  });
}

copyDir();