const helper = require('../helper.js');
const BenutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();
var CryptoJS = require("crypto-js");

console.log('- Service Nutzer');

serviceRouter.post('/benutzer/', function(request, response) {
    console.log('Service Benutzer: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('Name fehlt');
    if (helper.isUndefined(request.body.email)) {
        errorMsgs.push('Email fehlt');
    } else if (false === helper.isEmail(request.body.email)) {
        errorMsgs.push('Keine Email');
    }
    if (helper.isUndefined(request.body.passwort)) 
        errorMsgs.push('passwort fehlt');
    if (errorMsgs.length > 0) {
        console.log('Service Benutzer: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    var key = "kjfngsvkf423jblkvyv645§!opjgodfpadfsdfkdsagkdapgasdfüpdfkbgknüpgfhodfe343985ß0i94$§$2()§/$()fsadfsdfsadf";
    var sessionID = CryptoJS.HmacSHA256(request.body.name+request.body.name+request.body.passwort, key);
    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.create(request.body.idBenutzer, request.body.name, request.body.name, request.body.passwort, sessionID);
        console.log('Service Benutzer: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Benutzer: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;