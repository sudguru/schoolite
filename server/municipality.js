"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
exports.sqlTasksMunicipality = function () {
    electron_1.ipcMain.on('getMunicipalityData', function (event, forWhat) {
        var result = db_1.knex.select().table('municipality');
        result.then(function (rows) {
            if (forWhat === 'forApp') {
                event.sender.send('municipalityDataSentforApp', rows);
            }
            else {
                event.sender.send('municipalityDataSentforSync', rows);
            }
        });
    });
    electron_1.ipcMain.on('updateMunicipality', function (event, municipality) {
        var ts = Date.now();
        if (municipality.id === 0) {
            var result = db_1.knex('municipality').insert({
                id: ts, municipality: municipality.municipality, municipality_nepali: municipality.municipality_nepali, mts: ts, deleted: 0
            });
            result.then(function (outcome) {
                event.sender.send('municipalityAdded', outcome);
            });
        }
        else {
            var result = db_1.knex('municipality')
                .where('id', municipality.id)
                .update({ municipality: municipality.municipality, municipality_nepali: municipality.municipality_nepali, mts: ts });
            result.then(function (outcome) {
                event.sender.send('municipalityModified', outcome);
            });
        }
    });
    electron_1.ipcMain.on('deleteMunicipality', function (event, municipality_id) {
        var ts = Date.now();
        var result = db_1.knex('municipality')
            .where('id', municipality_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('municipalityDeleted', outcome);
        });
    });
    electron_1.ipcMain.on('restoreMunicipality', function (event, municipality_id) {
        var ts = Date.now();
        var result = db_1.knex('municipality')
            .where('id', municipality_id)
            .update({ deleted: 0, mts: ts });
        result.then(function (outcome) {
            event.sender.send('municipalityRestored', outcome);
        });
    });
    electron_1.ipcMain.on('syncMunicipalityDataFromRemote', function (event, remoteMunicipalityData) {
        // Update & Add
        // if there are new records viz not in local then add
        // else update
        db_1.log.info('municipality sync started');
        remoteMunicipalityData.forEach(function (record) {
            var result = db_1.knex('municipality').where('id', +record.id);
            result.then(function (rows) {
                if (rows.length === 1) {
                    // console.log(rows.length, ' ', rows[0].mts);
                    if (+record.mts > rows[0].mts) {
                        // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
                        db_1.knex('municipality').where('id', +record.id)
                            .update({
                            municipality: record.municipality,
                            municipality_nepali: record.municipality_nepali,
                            deleted: record.deleted,
                            mts: record.mts
                        })
                            .catch(function (err) {
                            if (err) {
                                db_1.log.info('municipality sync update ' + err);
                            }
                        });
                    }
                }
                else {
                    // console.log('inserting', record.id);
                    db_1.knex('municipality')
                        .insert({
                        id: record.id,
                        municipality: record.municipality,
                        municipality_nepali: record.municipality_nepali,
                        deleted: record.deleted,
                        mts: record.mts
                    }).catch(function (err) {
                        if (err) {
                            db_1.log.info('municipality sync insert ' + err);
                        }
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=municipality.js.map