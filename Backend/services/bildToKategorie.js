const helper = require('../helper.js');
const BildToKategorieDao = require('../dao/bildToKategorieDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service BildToKategorie');


serviceRouter.post('/bildToKategorie/hinzuefugen', function(request, response) {
    console.log('Service BildToKategorie: Client requested creation of new record');

    const bildToKategorieDao = new BildToKategorieDao(request.app.locals.dbConnection);
    try {
        var obj = bildToKategorieDao.create(request.body.idBild,request.body.idKategorie);
        console.log('Service BildToKategorie: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service BildToKategorie: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/bildToKategorie/loadKategorieIdbyBildId/:id', function(request, response){
    console.log('Service BildToKategorie: Client requested Kategorie of Bild');

    const bildToKategorieDao = new BildToKategorieDao(request.app.locals.dbConnection);
    try {
        var obj = bildToKategorieDao.loadKategorieIdbyBildId(request.params.id);
        console.log('Service BildToKategorie: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service BildToKategorie: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
})

serviceRouter.get('/bildToKategorie/loadKategorieIdbyBildId/:id', function(request, response){
    console.log('Service BildToKategorie: Client requested Single Bild');

    const bildToKategorieDao = new BildToKategorieDao(request.app.locals.dbConnection);
    try {
        var obj = bildToKategorieDao.loadKategorieIdbyBildId(request.params.id);
        console.log('Service BildToKategorie: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service BildToKategorie: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
})

serviceRouter.get('/bildtoKategorie/alle/:kategorie', function(request, response) {
    console.log('Service Bild: Client requested all records with id=' + request.params.kategorie);

    const bildDao = new BildToKategorieDao(request.app.locals.dbConnection);
    try {
        var arr = bildDao.loadByKategoriename(request.params.kategorie);
        console.log('Service Bild2Kategorie: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Bild2Kategorie: Error loading all records with id=' + request.params.kategorie + '. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;