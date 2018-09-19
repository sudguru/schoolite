"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var os = require('os');
var log = require('electron-log');
log.transports.file.level = 'info';
log.info('/Users/' + os.userInfo().username + '/.schoolite/schools.sqlite');
var dbPath;
if (process.platform !== 'darwin') {
    dbPath = 'D:\\schoolite_data\\schools.sqlite';
}
else {
    dbPath = '/Users/' + os.userInfo().username + '/.schoolite/schools.sqlite';
}
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: dbPath
    }
});
exports.sqlTasks = function () {
    // get Schools
    electron_1.ipcMain.on('getData', function (event) {
        var result = knex.from('sk')
            .innerJoin('schools', 'sk.id', 'schools.sk_id')
            .innerJoin('municipality', 'schools.n_id', 'municipality.id').limit(7);
        result.then(function (rows) {
            event.sender.send('resultSent', rows);
        });
    });
    // get Clusters
    electron_1.ipcMain.on('getClusterData', function (event) {
        var result = knex.select().table('clusters');
        result.then(function (rows) {
            event.sender.send('clusterDataSent', rows);
        });
    });
    // add update Clusters
    electron_1.ipcMain.on('updateCluster', function (event, cluster) {
        console.log(cluster);
        if (cluster.id === 0) {
            var result = knex('clusters').insert({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali });
            result.then(function (outcome) {
                event.sender.send('clusterAdded', outcome);
            });
        }
        else {
            var result = knex('clusters')
                .where('id', cluster.id)
                .update({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali });
            result.then(function (outcome) {
                event.sender.send('clusterModified', outcome);
            });
        }
    });
    // delete Clusters
    electron_1.ipcMain.on('deleteCluster', function (event, cluster_id) {
        var result = knex('clusters')
            .where('id', cluster_id)
            .del();
        result.then(function (outcome) {
            event.sender.send('clusterDeleted', outcome);
        });
    });
};
//# sourceMappingURL=mainsqlite.js.map