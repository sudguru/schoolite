import {ipcMain} from 'electron';
const os = require('os');

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

exports.sqlTasks = () => {
    // get Schools
    ipcMain.on('getData', function (event) {
      const result = knex.from('sk')
      .innerJoin('schools', 'sk.id', 'schools.sk_id')
      .innerJoin('municipality', 'schools.n_id', 'municipality.id').limit(7);
      result.then(rows => {
          event.sender.send('resultSent', rows);
      });
    });

    // get Clusters
    ipcMain.on('getClusterData', function (event) {
      const result = knex.select().table('clusters');
      result.then(rows => {
          event.sender.send('clusterDataSent', rows);
      });
    });

    // add update Clusters
    ipcMain.on('updateCluster', function (event, cluster) {
      console.log(cluster);
      if (cluster.id === 0) {
        const result = knex('clusters').insert({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali });
        result.then(outcome => {
          event.sender.send('clusterAdded', outcome);
        });
      } else {
        const result = knex('clusters')
        .where('id', cluster.id)
        .update({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali });
        result.then(outcome => {
          event.sender.send('clusterModified', outcome);
        });
      }
    });

    // delete Clusters
    ipcMain.on('deleteCluster', function (event, cluster_id) {
      const result = knex('clusters')
      .where('id', cluster_id)
      .del();
      result.then(outcome => {
        event.sender.send('clusterDeleted', outcome);
      });
    });

};
