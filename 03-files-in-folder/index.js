const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (error, files) => {
  if(error) throw error;
  files.forEach(file => {
    fs.stat(path.join(__dirname, 'secret-folder', file), (error, stats) => {
      if(error) throw error;
      let message = '';
      if (stats.isFile()) {
        message = `${path.parse(file).name} - ${path.parse(file).ext} - ${stats.size}b`;
        console.log(message);
      }
    });
  });
});