const helper = require('../helper.js');
const benutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Nutzer');

serviceRouter.post('/benutzer', function(request, response) {
    console.log('Service Benutzer: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('Name fehlt');
    if (helper.isUndefined(request.body.email)) {
        errorMsgs.push('Email fehlt');
    } else if (!helper.isEmail(request.body.email)) {
        errorMsgs.push('Keine Email');
    }
    if (helper.isUndefined(request.body.passwort)) 
        errorMsgs.push('passwort fehlt');
    if (errorMsgs.length > 0) {
        console.log('Service Benutzer: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const benutzerDao = new benutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.create(1, request.body.name, request.body.email, request.body.passwort);
        console.log('Service Benutzer: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Benutzer: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;