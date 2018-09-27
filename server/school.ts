import {ipcMain} from 'electron';
import { knex, log } from './db';


exports.sqlTasksSchools = () => {

    ipcMain.on('getSchoolData', function (event) {
      const result = knex.select('schools.*', 'cluster', 'municipality', 'sk').from('schools')
      .innerJoin('sk', 'schools.sk_id', 'sk.id')
      .innerJoin('municipality', 'schools.m_id', 'municipality.id')
      .innerJoin('clusters', 'schools.c_id', 'clusters.id');
      result.then(rows => {
          event.sender.send('resultSent', rows);
      });
    });

    ipcMain.on('getLookUps', function(event) {
      const result = { municipalities: [], sks: [], clusters: []};
      return knex.select().from('municipality')
      .then(rows => result.municipalities = rows)
      .then(() => knex.select().from('sk'))
      .then(rows => result.sks = rows)
      .then(() => knex.select().from('clusters'))
      .then(rows => result.clusters = rows)
      .then(() => {
        event.sender.send('lookupDataSent', result);
      });
    });

    ipcMain.on('saveImage', function (event, filedata) {
      console.log('saving image', filedata.filename, ' ' , +filedata.id );
      const result = knex('schools')
      .where('id', +filedata.id)
      .update({photo: filedata.filename});
      result.then(outcome => { event.sender.send('imageUpdated', filedata.filename); });
    });

    ipcMain.on('updateSchool', function (event, school) {
      const ts = Date.now();
      if (school.id === 0) {
        const result = knex('schools').insert({
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
        result.then(outcome => {
          event.sender.send('schoolAdded', outcome);
        });
      } else {
        const result = knex('schools')
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
        result.then(outcome => {
          event.sender.send('schoolModified', outcome);
        });
      }
    });

    ipcMain.on('deleteSchool', function (event, school_id) {
      const ts = Date.now();
      const result = knex('schools')
      .where('id', school_id)
      .update({deleted: 1, mts: ts});
      result.then(outcome => {
        event.sender.send('schoolDeleted', outcome);
      });
    });
};
