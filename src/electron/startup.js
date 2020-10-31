import { Socket } from 'net';
import * as process from 'child_process'


const port = 8080;
const client = new Socket();

let startedElectron = false;
const tryConnection = () =>
  client.connect({ port: port }, () => {
    client.end();
    if (!startedElectron) {
      console.log('starting electron');
      startedElectron = true;
      const exec = process.exec;

      exec('yarn run electron');
    }
  });

tryConnection();

client.on('error', (error) => {
  setTimeout(tryConnection, 5000);
  console.log(error.message);
});
