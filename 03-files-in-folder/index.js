const fs = require('fs');
const path = require('path');

fs.readdir('./03-files-in-folder/secret-folder', (error, files) => {
  if(error) throw error;
  files.forEach(file => {
    fs.stat(`./03-files-in-folder/secret-folder/${file}`, (error, stats) => {
      if(error) throw error;
      let message = '';
      if (stats.isFile()) {
        message = `${path.parse(file).name} - ${path.parse(file).ext} - ${stats.size}b`
        console.log(message);
      }
    })
  })
});