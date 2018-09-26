"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
exports.sqlTasksSK = function () {
    electron_1.ipcMain.on('getSKData', function (event, forWhat) {
        var result = db_1.knex.select().table('sk');
        result.then(function (rows) {
            if (forWhat === 'forApp') {
                event.sender.send('skDataSentforApp', rows);
            }
            else {
                event.sender.send('skDataSentforSync', rows);
            }
        });
    });
    electron_1.ipcMain.on('updateSK', function (event, sk) {
        var ts = Date.now();
        if (sk.id === 0) {
            var result = db_1.knex('sk').insert({
                id: ts, sk: sk.sk, sk_nepali: sk.sk_nepali, mts: ts, deleted: 0
            });
            result.then(function (outcome) {
                event.sender.send('skAdded', outcome);
            });
        }
        else {
            var result = db_1.knex('sk')
                .where('id', sk.id)
                .update({ sk: sk.sk, sk_nepali: sk.sk_nepali, mts: ts });
            result.then(function (outcome) {
                event.sender.send('skModified', outcome);
            });
        }
    });
    electron_1.ipcMain.on('deleteSK', function (event, sk_id) {
        var ts = Date.now();
        var result = db_1.knex('sk')
            .where('id', sk_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('skDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('restoreSK', function (event, sk_id) {
        var ts = Date.now();
        var result = db_1.knex('sk')
            .where('id', sk_id)
            .update({ deleted: 0, mts: ts });
        result.then(function (outcome) {
            event.sender.send('skRestored', outcome);
        });
    });
    electron_1.ipcMain.on('syncSKDataFromRemote', function (event, remoteSKData) {
        // Update & Add
        // if there are new records viz not in local then add
        // else update
        db_1.log.info('sk sync started');
        remoteSKData.forEach(function (record) {
            var result = db_1.knex('sk').where('id', +record.id);
            result.then(function (rows) {
                if (rows.length === 1) {
                    // console.log(rows.length, ' ', rows[0].mts);
                    if (+record.mts > rows[0].mts) {
                        // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
                        db_1.knex('sk').where('id', +record.id)
                            .update({
                            sk: record.sk,
                            sk_nepali: record.sk_nepali,
                            deleted: record.deleted,
                            mts: record.mts
                        })
                            .catch(function (err) {
                            if (err) {
                                db_1.log.info('sk sync update ' + err);
                            }
                        });
                    }
                }
                else {
                    // console.log('inserting', record.id);
                    db_1.knex('sk')
                        .insert({
                        id: record.id,
                        sk: record.sk,
                        sk_nepali: record.sk_nepali,
                        deleted: record.deleted,
                        mts: record.mts
                    }).catch(function (err) {
                        if (err) {
                            db_1.log.info('sk sync insert ' + err);
                        }
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=sk.js.map