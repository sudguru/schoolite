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
        var result = knex.from('schools')
            .innerJoin('sk', 'schools.sk_id', 'sk.id')
            .innerJoin('municipality', 'schools.n_id', 'municipality.id')
            .innerJoin('clusters', 'schools.c_id', 'clusters.id');
        result.then(function (rows) {
            event.sender.send('resultSent', rows);
        });
    });
    // add update Schools
    electron_1.ipcMain.on('updateSchool', function (event, school) {
        var ts = Date.now();
        if (school.id === 0) {
            var result = knex('schools').insert({
                id: ts,
                name: school.name,
                n_id: school.nid,
                ward_no: school.ward_no,
                principal: school.principal,
                address: school.address,
                office_no: school.office_no,
                mobile_no: school.mobile_no,
                classes_upto: school.classes_upto,
                c_id: school.c_id,
                email: school.email,
                contact_person: school.contact_person,
                contact_no: school.contact_no,
                estd: school.estd,
                post_box: school.post_box,
                home_no: school.home_no,
                cdo: school.cdo,
                sk_id: school.sk_id,
                photo: school.photo,
                mts: school.mts,
                deleted: school.deleted
            });
            result.then(function (outcome) {
                event.sender.send('schoolAdded', outcome);
            });
        }
        else {
            var result = knex('schools')
                .where('id', school.id)
                .update({
                id: ts,
                name: school.name,
                n_id: school.nid,
                ward_no: school.ward_no,
                principal: school.principal,
                address: school.address,
                office_no: school.office_no,
                mobile_no: school.mobile_no,
                classes_upto: school.classes_upto,
                c_id: school.c_id,
                email: school.email,
                contact_person: school.contact_person,
                contact_no: school.contact_no,
                estd: school.estd,
                post_box: school.post_box,
                home_no: school.home_no,
                cdo: school.cdo,
                sk_id: school.sk_id,
                photo: school.photo,
                mts: school.mts,
                deleted: school.deleted
            });
            result.then(function (outcome) {
                event.sender.send('schoolModified', outcome);
            });
        }
    });
    // delete School
    electron_1.ipcMain.on('deleteSchool', function (event, school_id) {
        var ts = Date.now();
        var result = knex('schools')
            .where('id', school_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('schoolDeleted', outcome);
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
        var ts = Date.now();
        if (cluster.id === 0) {
            var result = knex('clusters').insert({ id: ts, cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts });
            result.then(function (outcome) {
                event.sender.send('clusterAdded', outcome);
            });
        }
        else {
            var result = knex('clusters')
                .where('id', cluster.id)
                .update({ cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts });
            result.then(function (outcome) {
                event.sender.send('clusterModified', outcome);
            });
        }
    });
    // delete Clusters
    electron_1.ipcMain.on('deleteCluster', function (event, cluster_id) {
        var ts = Date.now();
        var result = knex('clusters')
            .where('id', cluster_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('clusterDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('syncClusterDataFromRemote', function (event, remoteClusterData) {
        // Update & Add
        // if there are new records viz not in local then add
        // else update
        log.info('cluster sync started');
        remoteClusterData.forEach(function (record) {
            var result = knex('clusters').where('id', +record.id);
            result.then(function (rows) {
                if (rows.length === 1) {
                    // console.log(rows.length, ' ', rows[0].mts);
                    if (+record.mts > rows[0].mts) {
                        // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
                        knex('clusters').where('id', +record.id)
                            .update({ cluster: record.cluster, cluster_nepali: record.cluster_nepali, deleted: record.deleted, mts: record.mts })
                            .catch(function (err) {
                            if (err) {
                                log.info('cluster sync update ' + err);
                            }
                        });
                    }
                }
                else {
                    // console.log('inserting', record.id);
                    knex('clusters')
                        .insert({
                        id: record.id,
                        cluster: record.cluster,
                        cluster_nepali: record.cluster_nepali,
                        deleted: record.deleted,
                        mts: record.mts
                    }).catch(function (err) {
                        if (err) {
                            log.info('cluster sync insert ' + err);
                        }
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=mainsqlite.js.map