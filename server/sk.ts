import {ipcMain} from 'electron';
import { knex, log } from './db';


exports.sqlTasksSK = () => {

    ipcMain.on('getSKData', function (event, forWhat) {
      const result = knex.select().table('sk');
      result.then(rows => {
          if (forWhat === 'forApp') {
            event.sender.send('skDataSentforApp', rows);
          } else {
            event.sender.send('skDataSentforSync', rows);
          }
      });
    });

    ipcMain.on('updateSK', function (event, sk) {
      const ts = Date.now();
      if (sk.id === 0) {
        const result = knex('sk').insert({
          id: ts, sk: sk.sk, sk_nepali: sk.sk_nepali, mts: ts, deleted: 0
        });
        result.then(outcome => {
          event.sender.send('skAdded', outcome);
        });
      } else {
        const result = knex('sk')
        .where('id', sk.id)
        .update({ sk: sk.sk, sk_nepali: sk.sk_nepali, mts: ts });
        result.then(outcome => {
          event.sender.send('skModified', outcome);
        });
      }
    });

    ipcMain.on('deleteSK', function (event, sk_id) {
      const ts = Date.now();
      const result = knex('sk')
      .where('id', sk_id)
      .update({deleted: 1, mts: ts});
      result.then(outcome => {
        event.sender.send('skDeleted', outcome);
      });
    });

    ipcMain.on('restoreSK', function (event, sk_id) {
      const ts = Date.now();
      const result = knex('sk')
      .where('id', sk_id)
      .update({deleted: 0, mts: ts});
      result.then(outcome => {
        event.sender.send('skRestored', outcome);
      });
    });

    ipcMain.on('syncSKDataFromRemote', function(event, remoteSKData) {
      // Update & Add
      // if there are new records viz not in local then add
      // else update
      log.info('sk sync started');
      remoteSKData.forEach(record => {
        const result = knex('sk').where('id', +record.id);
        result.then(rows => {
          if (rows.length === 1) {
            // console.log(rows.length, ' ', rows[0].mts);
            if (+record.mts > rows[0].mts) {
              // console.log('update' , rows.length, ' ', rows[0].mts , ' ' , +record.mts);
              knex('sk').where('id', +record.id)
              .update({
                  sk: record.sk,
                  sk_nepali: record.sk_nepali,
                  deleted: record.deleted,
                  mts: record.mts
                })
              .catch(err => {
                if (err) { log.info('sk sync update ' + err); }
              });
            }
          } else {
            // console.log('inserting', record.id);
            knex('sk')
            .insert({
              id: record.id,
              sk: record.sk,
              sk_nepali: record.sk_nepali,
              deleted: record.deleted,
              mts: record.mts
            }).catch(err => {
              if (err) { log.info('sk sync insert ' + err); }
            });
          }
        });
      });
    });

};
