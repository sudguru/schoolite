"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
exports.sqlTasksEF = function () {
    electron_1.ipcMain.on('getEFData', function (event, forWhat) {
        var result = db_1.knex.select().table('extra_fields');
        result.then(function (rows) {
            if (forWhat === 'forApp') {
                event.sender.send('efDataSentforApp', rows);
            }
            else {
                event.sender.send('efDataSentforSync', rows);
            }
        });
    });
    electron_1.ipcMain.on('updateEF', function (event, ef) {
        var ts = Date.now();
        if (ef.id === 0) {
            var result = db_1.knex('extra_fields').insert({
                id: ts,
                field_name: ef.field_name,
                field_type: ef.field_type,
                sub_fields: ef.sub_fields,
                display_order: ef.display_order,
                mts: ts,
                deleted: 0
            });
            result.then(function (outcome) {
                event.sender.send('efAdded', outcome);
            });
        }
        else {
            var result = db_1.knex('extra_fields')
                .where('id', ef.id)
                .update({
                field_name: ef.field_name,
                field_type: ef.field_type,
                sub_fields: ef.sub_fields,
                display_order: ef.display_order,
                mts: ts
            });
            result.then(function (outcome) {
                event.sender.send('efModified', outcome);
            });
        }
    });
    electron_1.ipcMain.on('deleteEF', function (event, ef_id) {
        var ts = Date.now();
        var result = db_1.knex('extra_fields')
            .where('id', ef_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('efDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('restoreEF', function (event, ef_id) {
        var ts = Date.now();
        var result = db_1.knex('extra_fields')
            .where('id', ef_id)
            .update({ deleted: 0, mts: ts });
        result.then(function (outcome) {
            event.sender.send('efRestored', outcome);
        });
    });
    electron_1.ipcMain.on('syncEFDataFromRemote', function (event, remoteEFData) {
        // Update & Add
        // if there are new records viz not in local then add
        // else update
        db_1.log.info('Extra Fields sync started');
        remoteEFData.forEach(function (record) {
            var result = db_1.knex('extra_fields').where('id', +record.id);
            result.then(function (rows) {
                if (rows.length === 1) {
                    // console.log(rows.length, ' ', rows[0].mts);
                    if (+record.mts > rows[0].mts) {
                        // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
                        db_1.knex('extra_fields').where('id', +record.id)
                            .update({
                            ef: record.ef,
                            ef_nepali: record.ef_nepali,
                            deleted: record.deleted,
                            mts: record.mts
                        })
                            .catch(function (err) {
                            if (err) {
                                db_1.log.info('ef sync update ' + err);
                            }
                        });
                    }
                }
                else {
                    // console.log('inserting', record.id);
                    db_1.knex('extra_fields')
                        .insert({
                        id: record.id,
                        ef: record.ef,
                        ef_nepali: record.ef_nepali,
                        deleted: record.deleted,
                        mts: record.mts
                    }).catch(function (err) {
                        if (err) {
                            db_1.log.info('ef sync insert ' + err);
                        }
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=extra_fields.js.map