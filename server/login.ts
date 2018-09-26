import {ipcMain} from 'electron';
import { knex, log } from './db';


exports.sqlTasksLogin = () => {
    ipcMain.on('login', function (event, credentials) {
      console.log(credentials);
      const result = knex('users')
      .where({
        email: credentials.email,
        password: credentials.password
      }).select();
      result.then(rows => {
        console.log(rows);
        if (rows.length === 1) {
          event.sender.send('loginSuccess', rows);
        } else {
          event.sender.send('loginFailure', rows);
        }
      });
    });
};
