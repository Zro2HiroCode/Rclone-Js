const { spawn } = require('child_process');
const proc = spawn('C:\\rclone\\rclone.exe', ['version'], { shell: false });
proc.stdout.on('data', data => console.log(data.toString()));
proc.stderr.on('data', data => console.log(data.toString()));
proc.on('close', code => console.log('Exit code:', code));