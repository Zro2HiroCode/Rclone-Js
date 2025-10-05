const chokidar = require('chokidar');
const { spawn } = require('child_process');

// ตั้งค่าตำแหน่งโฟลเดอร์ที่ต้องการเฝ้าดู
const WATCH_PATH1 = 'G:/My Drive'; // local path ของ My Drive
const WATCH_PATH2 = 'E:/MEGA';     // local path ของ MEGA
const RCLONE_EXE = 'C:/rclone/rclone.exe';
const PATH1 = 'My Drive:';
const PATH2 = 'MEGA:';

function triggerSync(reason) {
  console.log('ตรวจพบการเปลี่ยนแปลง:', reason, 'กำลังซิงค์...');
const WORKDIR = 'C:/rclone/workdir';
const args = [
  'bisync', PATH1, PATH2,
  `--workdir=${WORKDIR}`, '-v', '--resync'
];
  const proc = spawn(RCLONE_EXE, args, { shell: false });
  proc.stdout.on('data', d => process.stdout.write(d.toString()));
  proc.stderr.on('data', d => process.stdout.write(d.toString()));
  proc.on('close', code => {
    console.log('ซิงค์เสร็จสิ้น (exit code', code, ')');
  });
}

chokidar.watch(WATCH_PATH1, { persistent: true, ignoreInitial: true, depth: 99 })
  .on('add', path => triggerSync('My Drive เพิ่มไฟล์: ' + path))
  .on('change', path => triggerSync('My Drive แก้ไขไฟล์: ' + path))
  .on('unlink', path => triggerSync('My Drive ลบไฟล์: ' + path));

chokidar.watch(WATCH_PATH2, { persistent: true, ignoreInitial: true, depth: 99 })
  .on('add', path => triggerSync('MEGA เพิ่มไฟล์: ' + path))
  .on('change', path => triggerSync('MEGA แก้ไขไฟล์: ' + path))
  .on('unlink', path => triggerSync('MEGA ลบไฟล์: ' + path));
