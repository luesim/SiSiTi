const helper = require('../helper.js');
const BenutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();
const md5 = require("md5");

console.log('- Service Nutzer');

serviceRouter.get('/benutzer/:sessionID', function(request, response) {
    console.log('Service Benutzer: Client requested one record, sessionID=' + request.params.sessionID);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.loadBySessionID(request.params.sessionID);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Benutzer: Error loading record by name or email. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
}); 

serviceRouter.get('/benutzer/nameUndEmail/:name/:email', function(request, response) {
    console.log('Service Benutzer: Client requested one record, name,email=' + request.params.name + "," + request.params.email);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        benutzerDao.CheckName(request.params.name);
        benutzerDao.CheckEmail(request.params.email);
        response.status(200).json({"result": true});
    } catch (ex) {
        console.error('Service Benutzer: Error loading record by name or email. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
}); 

//Für diese Abfrage muss mindestens ein Eintrag in der Tabelle Benutzer vorhanden sein.
serviceRouter.get('/benutzer/nameUndEmail/:name/:email', function(request, response) {
    console.log('Service Benutzer: Client requested one record, name,email=' + request.params.name + "," + request.params.email);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        benutzerDao.CheckName(request.params.name);
        benutzerDao.CheckEmail(request.params.email);
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


    //Passwort ändern.

    serviceRouter.put('/benutzer/neuesPasswort', function(request, response) { //neue Route machen
        console.log('Service Benutzer: Client requested update of existing record');
    
        var errorMsgs=[];
        if (helper.isUndefined(request.body.sessionID)) 
            errorMsgs.push('SessionID fehlt');
        if (helper.isUndefined(request.body.neuesPW)) 
            request.body.neuesPW = null;
           
        if (errorMsgs.length > 0) {
            console.log('Service Benutzer: Update not possible, data missing');
            response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
            return;
        }
    
        const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
        try {
            var obj = benutzerDao.changePasswort(request.body.sessionID, request.body.neuesPW); //muss hier alles geupdated werden oder reicht passwort?
            console.log('Service Benutzer: Record updated, sesssionID=' + request.body.sessionID);
            response.status(200).json(obj);
        } catch (ex) {
            console.error('Service Benutzer: Error updating record by id. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
        }    
    });


//Konto loeschen

serviceRouter.delete('/benutzer/:id', function(request, response) { //gibt es diese Route?
    console.log('Service Benutzer: Client requested deletion of record, id=' + request.params.id);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.loadById(request.params.idBenutzer);
        benutzerDao.delete(request.params.idBenutzer); //Alles gelöscht oder nur ID?
        console.log('Service Benutzer: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Benutzer: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;