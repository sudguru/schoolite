"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
exports.sqlTasksLogin = function () {
    electron_1.ipcMain.on('login', function (event, credentials) {
        console.log(credentials);
        var result = db_1.knex('users')
            .where({
            email: credentials.email,
            password: credentials.password
        }).select();
        result.then(function (rows) {
            console.log(rows);
            if (rows.length === 1) {
                event.sender.send('loginSuccess', rows);
            }
            else {
                event.sender.send('loginFailure', rows);
            }
        });
    });
};
//# sourceMappingURL=login.js.map