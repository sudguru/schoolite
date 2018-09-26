"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
exports.sqlTasksClusters = function () {
    electron_1.ipcMain.on('getClusterData', function (event, forWhat) {
        var result = db_1.knex.select().table('clusters');
        result.then(function (rows) {
            if (forWhat === 'forApp') {
                event.sender.send('clusterDataSentforApp', rows);
            }
            else {
                event.sender.send('clusterDataSentforSync', rows);
            }
        });
    });
    electron_1.ipcMain.on('updateCluster', function (event, cluster) {
        var ts = Date.now();
        if (cluster.id === 0) {
            var result = db_1.knex('clusters').insert({
                id: ts, cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts, deleted: 0
            });
            result.then(function (outcome) {
                event.sender.send('clusterAdded', outcome);
            });
        }
        else {
            var result = db_1.knex('clusters')
                .where('id', cluster.id)
                .update({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts });
            result.then(function (outcome) {
                event.sender.send('clusterModified', outcome);
            });
        }
    });
    electron_1.ipcMain.on('deleteCluster', function (event, cluster_id) {
        var ts = Date.now();
        var result = db_1.knex('clusters')
            .where('id', cluster_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('clusterDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('restoreCluster', function (event, cluster_id) {
        var ts = Date.now();
        var result = db_1.knex('clusters')
            .where('id', cluster_id)
            .update({ deleted: 0, mts: ts });
        result.then(function (outcome) {
            event.sender.send('clusterRestored', outcome);
        });
    });
    electron_1.ipcMain.on('syncClusterDataFromRemote', function (event, remoteClusterData) {
        // Update & Add
        // if there are new records viz not in local then add
        // else update
        db_1.log.info('cluster sync started');
        remoteClusterData.forEach(function (record) {
            var result = db_1.knex('clusters').where('id', +record.id);
            result.then(function (rows) {
                if (rows.length === 1) {
                    // console.log(rows.length, ' ', rows[0].mts);
                    if (+record.mts > rows[0].mts) {
                        // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
                        db_1.knex('clusters').where('id', +record.id)
                            .update({ cluster: record.cluster, cluster_nepali: record.cluster_nepali, deleted: record.deleted, mts: record.mts })
                            .catch(function (err) {
                            if (err) {
                                db_1.log.info('cluster sync update ' + err);
                            }
                        });
                    }
                }
                else {
                    // console.log('inserting', record.id);
                    db_1.knex('clusters')
                        .insert({
                        id: record.id,
                        cluster: record.cluster,
                        cluster_nepali: record.cluster_nepali,
                        deleted: record.deleted,
                        mts: record.mts
                    }).catch(function (err) {
                        if (err) {
                            db_1.log.info('cluster sync insert ' + err);
                        }
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=cluster.js.map