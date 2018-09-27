import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
const ipcTasksLogin = require('./server/login');
const ipcTasksSchool = require('./server/school');
const ipcTasksCluster = require('./server/cluster');
const ipcTasksMunitcipality = require('./server/municipality');
const ipcTasksSK = require('./server/sk');
const ipcTasksEF = require('./server/extra_fields');


let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    // width: size.width,
    // height: size.height,
    width: 1200,
    height: 700,
    frame: false
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }



  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

}


try {

  app.on('ready', () => {
    createWindow();
    ipcTasksLogin.sqlTasksLogin();
    ipcTasksSchool.sqlTasksSchools();
    ipcTasksCluster.sqlTasksClusters();
    ipcTasksMunitcipality.sqlTasksMunicipality();
    ipcTasksSK.sqlTasksSK();
    ipcTasksEF.sqlTasksEF();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
