import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron';
import * as path from 'path';
const os = require('os');
import * as url from 'url';

const log = require('electron-log');
log.transports.file.level = 'info';

log.info('/Users/' + os.userInfo().username + '/.schoolite/schools.sqlite');
let dbPath;
if (process.platform !== 'darwin') {
  dbPath = 'D:\\schoolite_data\\schools.sqlite';
} else {
  dbPath = '/Users/' + os.userInfo().username + '/.schoolite/schools.sqlite';
}

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: dbPath
  }
});

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    // width: size.width,
    // height: size.height,
    width: 1000,
    height: 650,
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

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}



try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
    // const mymenu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(mymenu);
    sqlTasks();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}


///////////////////

function sqlTasks() {

  // Schools Begin ///////////////////////////////////////////////////////
  // get schools
  ipcMain.on('getData', function () {
    const result = knex.from('sk')
    .innerJoin('schools', 'sk.id', 'schools.sk_id')
    .innerJoin('municipality', 'schools.n_id', 'municipality.id');
    result.then(rows => {
        win.webContents.send('resultSent', rows);
    });
  });

  // Schools End ///////////////////////////////////////////////////////




  // Clusters Begin ///////////////////////////////////////////////////////
  // get Clusters
  ipcMain.on('getClusterData', function () {
    const result = knex.select().table('clusters');
    result.then(rows => {
        win.webContents.send('clusterDataSent', rows);
    });
  });

  // add update Clusters
  ipcMain.on('updateCluster', function (event, cluster) {
    console.log(cluster);
    if (cluster.id === 0) {
      const result = knex('clusters').insert({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali });
      result.then(outcome => {
        win.webContents.send('clusterAdded', outcome);
      });
    } else {
      const result = knex('clusters')
      .where('id', cluster.id)
      .update({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali });
      result.then(outcome => {
        win.webContents.send('clusterModified', outcome);
      });
    }
  });

  // delete Clusters
  ipcMain.on('deleteCluster', function (event, cluster_id) {
    const result = knex('clusters')
    .where('id', cluster_id)
    .del();
    result.then(outcome => {
      win.webContents.send('clusterDeleted', outcome);
    });
  });

  // Clusters End ///////////////////////////////////////////////////////
}


