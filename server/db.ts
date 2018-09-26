const os = require('os');
let dbPath;
if (process.platform !== 'darwin') {
  dbPath = 'D:\\schoolite_data\\schools.sqlite';
} else {
  dbPath = '/Users/' + os.userInfo().username + '/.schoolite/schools.sqlite';
}


export const knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: dbPath
  }
});

const logg = require('electron-log');
logg.transports.file.level = 'info';

export const log = logg;

