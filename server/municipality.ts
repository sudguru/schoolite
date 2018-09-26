import {ipcMain} from 'electron';
import { knex, log } from './db';


exports.sqlTasksMunicipality = () => {

    ipcMain.on('getMunicipalityData', function (event, forWhat) {
      const result = knex.select().table('municipality');
      result.then(rows => {
          if (forWhat === 'forApp') {
            event.sender.send('municipalityDataSentforApp', rows);
          } else {
            event.sender.send('municipalityDataSentforSync', rows);
          }
      });
    });

    ipcMain.on('updateMunicipality', function (event, municipality) {
      const ts = Date.now();
      if (municipality.id === 0) {
        const result = knex('municipality').insert({
          id: ts, municipality: municipality.municipality, municipality_nepali: municipality.municipality_nepali, mts: ts, deleted: 0
        });
        result.then(outcome => {
          event.sender.send('municipalityAdded', outcome);
        });
      } else {
        const result = knex('municipality')
        .where('id', municipality.id)
        .update({ municipality: municipality.municipality, municipality_nepali: municipality.municipality_nepali, mts: ts });
        result.then(outcome => {
          event.sender.send('municipalityModified', outcome);
        });
      }
    });

    ipcMain.on('deleteMunicipality', function (event, municipality_id) {
      const ts = Date.now();
      const result = knex('municipality')
      .where('id', municipality_id)
      .update({deleted: 1, mts: ts});
      result.then(outcome => {
        event.sender.send('municipalityDeleted', outcome);
      });
    });

    ipcMain.on('restoreMunicipality', function (event, municipality_id) {
      const ts = Date.now();
      const result = knex('municipality')
      .where('id', municipality_id)
      .update({deleted: 0, mts: ts});
      result.then(outcome => {
        event.sender.send('municipalityRestored', outcome);
      });
    });

    ipcMain.on('syncMunicipalityDataFromRemote', function(event, remoteMunicipalityData) {
      // Update & Add
      // if there are new records viz not in local then add
      // else update
      log.info('municipality sync started');
      remoteMunicipalityData.forEach(record => {
        const result = knex('municipality').where('id', +record.id);
        result.then(rows => {
          if (rows.length === 1) {
            // console.log(rows.length, ' ', rows[0].mts);
            if (+record.mts > rows[0].mts) {
              // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
              knex('municipality').where('id', +record.id)
              .update({
                  municipality: record.municipality,
                  municipality_nepali: record.municipality_nepali,
                  deleted: record.deleted,
                  mts: record.mts
                })
              .catch(err => {
                if (err) { log.info('municipality sync update ' + err); }
              });
            }
          } else {
            // console.log('inserting', record.id);
            knex('municipality')
            .insert({
              id: record.id,
              municipality: record.municipality,
              municipality_nepali: record.municipality_nepali,
              deleted: record.deleted,
              mts: record.mts
            }).catch(err => {
              if (err) { log.info('municipality sync insert ' + err); }
            });
          }
        });
      });
    });

};
