"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require('os');
var dbPath;
if (process.platform !== 'darwin') {
    dbPath = 'D:\\schoolite_data\\schools.sqlite';
}
else {
    dbPath = '/Users/' + os.userInfo().username + '/.schoolite/schools.sqlite';
}
exports.knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: dbPath
    }
});
var logg = require('electron-log');
logg.transports.file.level = 'info';
exports.log = logg;
//# sourceMappingURL=db.js.map