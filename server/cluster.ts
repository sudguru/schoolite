import {ipcMain} from 'electron';
import { knex, log } from './db';


exports.sqlTasksClusters = () => {

    ipcMain.on('getClusterData', function (event, forWhat) {
      const result = knex.select().table('clusters');
      result.then(rows => {
          if (forWhat === 'forApp') {
            event.sender.send('clusterDataSentforApp', rows);
          } else {
            event.sender.send('clusterDataSentforSync', rows);
          }
      });
    });

    ipcMain.on('updateCluster', function (event, cluster) {
      const ts = Date.now();
      if (cluster.id === 0) {
        const result = knex('clusters').insert({
          id: ts, cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts, deleted: 0
        });
        result.then(outcome => {
          event.sender.send('clusterAdded', outcome);
        });
      } else {
        const result = knex('clusters')
        .where('id', cluster.id)
        .update({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts });
        result.then(outcome => {
          event.sender.send('clusterModified', outcome);
        });
      }
    });

    ipcMain.on('deleteCluster', function (event, cluster_id) {
      const ts = Date.now();
      const result = knex('clusters')
      .where('id', cluster_id)
      .update({deleted: 1, mts: ts});
      result.then(outcome => {
        event.sender.send('clusterDeleted', outcome);
      });
    });

    ipcMain.on('restoreCluster', function (event, cluster_id) {
      const ts = Date.now();
      const result = knex('clusters')
      .where('id', cluster_id)
      .update({deleted: 0, mts: ts});
      result.then(outcome => {
        event.sender.send('clusterRestored', outcome);
      });
    });

    ipcMain.on('syncClusterDataFromRemote', function(event, remoteClusterData) {
      // Update & Add
      // if there are new records viz not in local then add
      // else update
      log.info('cluster sync started');
      remoteClusterData.forEach(record => {
        const result = knex('clusters').where('id', +record.id);
        result.then(rows => {
          if (rows.length === 1) {
            // console.log(rows.length, ' ', rows[0].mts);
            if (+record.mts > rows[0].mts) {
              // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
              knex('clusters').where('id', +record.id)
              .update({ cluster: record.cluster, cluster_nepali: record.cluster_nepali, deleted: record.deleted, mts: record.mts })
              .catch(err => {
                if (err) { log.info('cluster sync update ' + err); }
              });
            }
          } else {
            // console.log('inserting', record.id);
            knex('clusters')
            .insert({
              id: record.id,
              cluster: record.cluster,
              cluster_nepali: record.cluster_nepali,
              deleted: record.deleted,
              mts: record.mts
            }).catch(err => {
              if (err) { log.info('cluster sync insert ' + err); }
            });
          }
        });
      });
    });

};
