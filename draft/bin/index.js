#! /usr/bin/env node
import inquirer from 'inquirer';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const argv = process.argv.slice(2);
const __dirname = process.cwd();
const __filename = fileURLToPath(import.meta.url).replace(/index\.js$/, '');

if (argv && argv.length && argv[0] === 'generate') {
  console.log('You are trying to create a new game');
  
  inquirer.prompt([
    {

      type: 'input',
      name: 'gameName',
      message: 'Please input name of your new game',
      default: 'example',
    }
  ]).then(answers => {
    const gameName = answers.gameName.toLowerCase();
    const GameName = capitalize(gameName);
    const newPath = path.resolve(__dirname, `./src/game-redesign/impl/${gameName}`);

    if (fs.existsSync(newPath)) {
      console.log('This game has existed');

      return;
    }

    const files = fs.readdirSync(path.resolve(__filename, './example'));
    const implPath = path.resolve(__dirname, `./src/game-redesign/impl/${gameName}`);

    fs.mkdirSync(implPath, {recursive: true});
    
    const n = files.length;
    let count = 0;

    files.forEach(fileName => {
      const filePath = path.resolve(__filename, `./example/${fileName}`);

      fs.readFile(filePath, (err, data) => {
        data = data
          .toString()
          .replace(/__example__/g, gameName)
          .replace(/__Example__/g, GameName)
          .replace('// @ts-nocheck\n\n', '');

        fs.writeFile(`${implPath}/${fileName}`, data, () => {
          console.log(`${fileName} is done.`);

          if (++count === n) {
            console.log(`\nNow you can implement this game in ${implPath}`);
          }
        });
      });
    });

    console.log(`Name of your new game is ${GameName}/${gameName}`)
  });
}

/**
 * capitalize
 * @param {string} s 
 */
function capitalize(s) {
  try {
    return s[0].toUpperCase() + s.slice(1);
  }
  catch {
    return s;
  }
}