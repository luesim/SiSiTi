const helper = require('../helper.js');
const BildToKategorieDao = require('../dao/bildToKategorieDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service BildToKategorie');


serviceRouter.post('/bildToKategorie/hinzuefugen', function(request, response) {
    console.log('Service BildToKategoriee: Client requested creation of new record');

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


module.exports = serviceRouter;