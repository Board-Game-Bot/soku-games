import { dirname } from 'path';
import { fileURLToPath } from 'url';
import inquirer, { QuestionCollection } from 'inquirer';
import { copyAndReplace } from './utils';
import * as process from 'process';
import * as fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('hello cli');
console.log(__dirname);

const QUESTIONS: QuestionCollection = [
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate(input: string) {
      if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(input)) {
        return true;
      }
      return 'Project name may only include letters and numbers.';
    },
  },
];

const CURR_DIR = process.cwd();

const data = await inquirer.prompt(QUESTIONS);
const name = data['project-name'];
const templateDir = `${__dirname}/template`;
const targetDir = `${CURR_DIR}/soku-game-${name}`;

fs.mkdirSync(targetDir);

copyAndReplace(name, templateDir, targetDir);

console.log('done');
