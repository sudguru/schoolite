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
    electron_1.ipcMain.on('login', function (event, credentials) {
        console.log(credentials);
        var result = knex('users')
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
    electron_1.ipcMain.on('getSchoolData', function (event) {
        var result = knex.select('schools.*').from('schools')
            .innerJoin('sk', 'schools.sk_id', 'sk.id')
            .innerJoin('municipality', 'schools.n_id', 'municipality.id')
            .innerJoin('clusters', 'schools.c_id', 'clusters.id');
        result.then(function (rows) {
            event.sender.send('resultSent', rows);
        });
    });
    electron_1.ipcMain.on('saveImage', function (event, filedata) {
        console.log('saving image', filedata.filename, ' ', +filedata.id);
        var result = knex('schools')
            .where('id', +filedata.id)
            .update({ photo: filedata.filename });
        result.then(function (outcome) { event.sender.send('imageUpdated', filedata.filename); });
    });
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
                photo: 'dummy.jpg',
                mts: ts,
                deleted: 0
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
                mts: ts
            });
            result.then(function (outcome) {
                event.sender.send('schoolModified', outcome);
            });
        }
    });
    electron_1.ipcMain.on('deleteSchool', function (event, school_id) {
        var ts = Date.now();
        var result = knex('schools')
            .where('id', school_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('schoolDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('getClusterData', function (event, forWhat) {
        var result = knex.select().table('clusters');
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
            var result = knex('clusters').insert({
                id: ts, cluster: cluster.cluster, cluster_nepali: cluster.cluster_nepali, mts: ts, deleted: 0
            });
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
    electron_1.ipcMain.on('deleteCluster', function (event, cluster_id) {
        var ts = Date.now();
        var result = knex('clusters')
            .where('id', cluster_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('clusterDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('restoreCluster', function (event, cluster_id) {
        var ts = Date.now();
        var result = knex('clusters')
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