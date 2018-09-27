import {ipcMain} from 'electron';
import { knex, log } from './db';


exports.sqlTasksEF = () => {

    ipcMain.on('getEFData', function (event, forWhat) {
      const result = knex.select().table('extra_fields');
      result.then(rows => {
          if (forWhat === 'forApp') {
            event.sender.send('efDataSentforApp', rows);
          } else {
            event.sender.send('efDataSentforSync', rows);
          }
      });
    });

    ipcMain.on('updateEF', function (event, ef) {
      const ts = Date.now();
      if (ef.id === 0) {
        const result = knex('extra_fields').insert({
          id: ts,
          field_name: ef.field_name,
          field_type: ef.field_type,
          sub_fields: ef.sub_fields,
          display_order: ef.display_order,
          mts: ts,
          deleted: 0
        });
        result.then(outcome => {
          event.sender.send('efAdded', outcome);
        });
      } else {
        const result = knex('extra_fields')
        .where('id', ef.id)
        .update({
          field_name: ef.field_name,
          field_type: ef.field_type,
          sub_fields: ef.sub_fields,
          display_order: ef.display_order,
          mts: ts
        });
        result.then(outcome => {
          event.sender.send('efModified', outcome);
        });
      }
    });

    ipcMain.on('deleteEF', function (event, ef_id) {
      const ts = Date.now();
      const result = knex('extra_fields')
      .where('id', ef_id)
      .update({deleted: 1, mts: ts});
      result.then(outcome => {
        event.sender.send('efDeleted', outcome);
      });
    });

    ipcMain.on('restoreEF', function (event, ef_id) {
      const ts = Date.now();
      const result = knex('extra_fields')
      .where('id', ef_id)
      .update({deleted: 0, mts: ts});
      result.then(outcome => {
        event.sender.send('efRestored', outcome);
      });
    });

    ipcMain.on('syncEFDataFromRemote', function(event, remoteEFData) {
      // Update & Add
      // if there are new records viz not in local then add
      // else update
      log.info('Extra Fields sync started');
      remoteEFData.forEach(record => {
        const result = knex('extra_fields').where('id', +record.id);
        result.then(rows => {
          if (rows.length === 1) {
            // console.log(rows.length, ' ', rows[0].mts);
            if (+record.mts > rows[0].mts) {
              // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
              knex('extra_fields').where('id', +record.id)
              .update({
                  ef: record.ef,
                  ef_nepali: record.ef_nepali,
                  deleted: record.deleted,
                  mts: record.mts
                })
              .catch(err => {
                if (err) { log.info('ef sync update ' + err); }
              });
            }
          } else {
            // console.log('inserting', record.id);
            knex('extra_fields')
            .insert({
              id: record.id,
              ef: record.ef,
              ef_nepali: record.ef_nepali,
              deleted: record.deleted,
              mts: record.mts
            }).catch(err => {
              if (err) { log.info('ef sync insert ' + err); }
            });
          }
        });
      });
    });

};
