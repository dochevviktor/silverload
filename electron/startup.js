import { Socket } from 'net';
import exec from 'child_process';

const port = 8080;
const client = new Socket();

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

let startedElectron = false;
const tryConnection = () =>
  client.connect({ port: port }, () => {
    client.end();
    if (!startedElectron) {
      console.log('starting electron');
      startedElectron = true;

      exec.exec('yarn run electron:run');
    }
  });

tryConnection();

client.on('error', (error) => {
  setTimeout(tryConnection, 5000);
  console.log(error.message);
});
