import * as fs from 'fs';
import * as child_process from 'child_process';
export function copyAndReplace(name: string, from: string, to: string) {
  const replaces = [
    ['{{name}}', name],
    ['{{author}}', getMyName()],
    ['{{email}}', getMyEmail()],
    ['__name__', name[0].toUpperCase() + name.slice(1)],
  ];
  function replaceContent(s: string) {
    replaces.forEach(([f, t]) => (s = s.replace(new RegExp(f, 'g'), t)));
    return s;
  }

  function createDirectoryContents(from: string, to: string) {
    const filesToCreate = fs.readdirSync(from);

    filesToCreate.forEach((file) => {
      const filePath = `${from}/${file}`;
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const content = replaceContent(fs.readFileSync(filePath, 'utf-8'));
        const targetFilePath = `${to}/${file}`;
        fs.writeFileSync(targetFilePath, content, 'utf-8');
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${to}/${file}`);
        createDirectoryContents(`${from}/${file}`, `${to}/${file}`);
      }
    });
  }

  createDirectoryContents(from, to);
}

function getMyName() {
  return child_process
    .execSync('git config --get user.name')
    .toString()
    .replace('\n', '');
}

function getMyEmail() {
  return child_process
    .execSync('git config --get user.email')
    .toString()
    .replace('\n', '');
}
