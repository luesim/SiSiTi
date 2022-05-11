const helper = require('../helper.js');
const BenutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();
const md5 = require("md5");

console.log('- Service Nutzer');

//Für diese Abfrage muss mindestens ein Eintrag in der Tabelle Benutzer vorhanden sein.
serviceRouter.get('/benutzer/nameUndEmail/:name/:email', function(request, response) {
    console.log('Service Benutzer: Client requested one record, name,email=' + request.params.name + "," + request.params.email);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        benutzerDao.CheckName(request.params.name);
        benutzerDao.CheckEmail(request.params.email);
        console.log('Service Benutzer: User doesnt exist');
        response.status(200).json({"result": true});
    } catch (ex) {
        console.error('Service Benutzer: Error loading record by name or email. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
}); 


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
    if (request.body.passwort.length < 6) 
        errorMsgs.push('passwort zu kurz');
    if (false === request.body.agb) 
        errorMsgs.push('agb falsch');
    if (errorMsgs.length > 0) {
        console.log('Service Benutzer: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    var salt = "kjfngsvkfjblkvyvopjgodfpadfsdfkdsagkdapgasdfüpdfkbgknüpgfhodfe343985ß0i94$§$2()§/$()fsadfsdfsadf";
    var sessionID = md5(request.body.name+request.body.name+request.body.passwort+salt);
    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.create(request.body.idBenutzer, request.body.name, request.body.email, request.body.passwort, sessionID);
        console.log('Service Benutzer: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Benutzer: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/benutzer/emailUndPasswort/:email/:passwort', function(request, response) {
    console.log('Service Benutzer: Client trys a login with email,passwort=' + request.params.email + ',' + request.params.passwort);
    
    var errorMsgs=[];
    if (helper.isUndefined(request.params.email)) {
        errorMsgs.push('Email fehlt');
    } else if (false === helper.isEmail(request.params.email)) {
        errorMsgs.push('Keine Email');
    }
    if (helper.isUndefined(request.params.passwort))
        errorMsgs.push('passwort fehlt');
    if (request.params.passwort.length < 6) 
        errorMsgs.push('passwort zu kurz');
    if (errorMsgs.length > 0) {
        console.log('Service Benutzer: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }


    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.login(request.params.email, request.params.passwort);
        console.log('Service Benutzer: angemeldet');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Benutzer: Error with login. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
}); 

module.exports = serviceRouter;