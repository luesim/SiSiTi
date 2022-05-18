const helper = require('../helper.js');
const KategorieDao = require('../dao/kategorieDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Kategorie');

serviceRouter.get('/kategorie/bezeichnung/:kategorieBezeichnung', function(request, response) {
    console.log('Service Kategorie: Client requested one record, kategorieBezeichnung=' + request.params.kategorieBezeichnung);

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection);
    try {
        var obj = kategorieDao.loadByKategorieBezeichnung(request.params.kategorieBezeichnung);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Kategorie: Error loading record by bezeichnung. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
}); 

serviceRouter.post('/kategorie/hinzuefugen', function(request, response) {
    console.log('Service Kategorie: Client requested creation of new record');

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection);
    try {
        var obj = kategorieDao.create(request.body.idKategorie, request.body.bezeichnung);
        console.log('Service Kategorie: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Kategorie: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});


module.exports = serviceRouter;