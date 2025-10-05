const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = 3000;
const RCLONE_EXE = 'C:\\rclone\\rclone.exe';
const PATH1 = 'My Drive:';
const PATH2 = 'MEGA:';
const WORKDIR = 'C:\\rclone\\workdir';

app.post('/rclone', (req, res) => {
  if (!req.body || typeof req.body.command !== 'string') {
    return res.status(400).send('Missing command in request body');
  }
  const commandType = req.body.command;
  let args;
  if (commandType === 'dryrun') {
    args = [
      'bisync', PATH1, PATH2,
      `--workdir=${WORKDIR}`, '-v', '--resync', '--dry-run'
    ];
  } else if (commandType === 'resync') {
    args = [
      'bisync', PATH1, PATH2,
      `--workdir=${WORKDIR}`, '-v', '--resync'
    ];
  } else if (commandType === 'normal') {
    args = [
      'bisync', PATH1, PATH2,
      `--workdir=${WORKDIR}`, '-v'
    ];
  } else if (commandType === 'version') {
    args = ['version'];
  } else {
    return res.status(400).send('Unknown command');
  }
  console.log('Run:', RCLONE_EXE, args);
  const proc = spawn(RCLONE_EXE, args, { shell: false });
  let output = '';
  proc.stdout.on('data', data => output += data.toString());
  proc.stderr.on('data', data => output += data.toString());
  proc.on('close', code => {
    res.status(code === 0 ? 200 : 500).send(output);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at https://zro2hirocode.github.io/Rclone-Js/`);
});
