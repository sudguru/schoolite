"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
exports.sqlTasksSchools = function () {
    electron_1.ipcMain.on('getSchoolData', function (event) {
        var result = db_1.knex.select('schools.*', 'cluster', 'municipality', 'sk').from('schools')
            .innerJoin('sk', 'schools.sk_id', 'sk.id')
            .innerJoin('municipality', 'schools.m_id', 'municipality.id')
            .innerJoin('clusters', 'schools.c_id', 'clusters.id');
        result.then(function (rows) {
            event.sender.send('resultSent', rows);
        });
    });
    electron_1.ipcMain.on('saveImage', function (event, filedata) {
        console.log('saving image', filedata.filename, ' ', +filedata.id);
        var result = db_1.knex('schools')
            .where('id', +filedata.id)
            .update({ photo: filedata.filename });
        result.then(function (outcome) { event.sender.send('imageUpdated', filedata.filename); });
    });
    electron_1.ipcMain.on('updateSchool', function (event, school) {
        var ts = Date.now();
        if (school.id === 0) {
            var result = db_1.knex('schools').insert({
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
            var result = db_1.knex('schools')
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
        var result = db_1.knex('schools')
            .where('id', school_id)
            .update({ deleted: 1, mts: ts });
        result.then(function (outcome) {
            event.sender.send('schoolDeleted', outcome);
        });
    });
};
//# sourceMappingURL=school.js.map