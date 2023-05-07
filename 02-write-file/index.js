const fs = require('fs');
const { stdin, stdout } = process;

function init() {
  fs.writeFile('./02-write-file/text.txt', '', (error) => {
    if (error) return console.error(error.message);
  });
}

stdout.write('Введите желаемый текст\n');
stdin.on('data', data => {
  const text = data.toString();
  if (text.trim() === 'exit') { process.exit() };

  fs.access('./02-write-file/text.txt', fs.constants.F_OK, (err) => {
    if (err) init();

    fs.readFile('./02-write-file/text.txt', (error, data) => {
      if (error) return console.error(error.message);
      let existingText = data.toString();
      existingText += text;
      fs.writeFile('./02-write-file/text.txt', existingText, (error) => {
        if (error) return console.error(error.message);
      });
    });
  });
});

process.on('exit', () => stdout.write('\nПриложение завершило работу'));