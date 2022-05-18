const helper = require('../helper.js');
const fileHelper = require('../fileHelper.js');
const path = require('path');
const BildDao = require('../dao/bildDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Bild');

serviceRouter.post('/bild/aufladen/:benutzerid/:aufloesung', function(request, response) {
    console.log('Service Bild: Client requested creation of new record');
    const bildDao = new BildDao(request.app.locals.dbConnection);
    
    try{
        // if no files received, send error
        if (!fileHelper.hasUploadedFiles(request)) {
            console.log('no files transmitted, nothing to do');
            response.status(400).json({'fehler': true, 'nachricht': 'Keine Dateien aufgeladen'});
        } else {
            // get file object
            item=fileHelper.getAllUplodedFilesAsArray(request,true)[0];

            // get target path
            const targetPath = path.resolve(process.cwd(), '..','public', 'pics', item.name);
            console.log('target Path: ' + targetPath);

            if (item.isWebPicture && !fileHelper.existsFile(targetPath)) {
                console.log('item is webPicture and not present');                    

                // create target obj
                var fileObj = {
                    status: true,
                    fileSaved: false,
                    fileId: item.md5,
                    fileName: item.name,
                    fileSize: item.size,
                    fileMimeType: item.mimetype,
                    fileEncoding: item.encoding,
                    fileHandle: item.handleName,
                    fileNameOnly: item.nameOnly,
                    fileExtension: item.extension,
                    fileIsPicture: item.isPicture, 
                    fileIsWebPicture: item.isWebPicture
                };

                var errorMsgs=[];
                if (fileObj>1000000) 
                    errorMsgs.push('Bild zu groeß!');
                if (errorMsgs.length > 0) {
                    console.log('Service Bild: Creation not possible, data to big');
                    response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
                    return;
                }
                
                // now try to save file info in db
                try {
                    var savedObj = bildDao.create(fileObj.fileId,request.params.benutzerid,'pics/' + fileObj.fileName, fileObj.fileName, request.params.aufloesung, fileObj.fileMimeType, helper.getNow());
                    console.log('Service Bild: Record inserted in db, idBild=' + savedObj.IDBILD);
                    // transfer file to target folder with target name
                    item.mv(targetPath);
                    // remember status
                    fileObj.fileSaved = true;
                } catch (ex) {
                    console.error('Service Bild: Error creating record. Exception occured: ' + ex.message);
                }
            } else {
                console.log('item is no webPicture or already present, skipping it');
            }

            // send response 
            response.status(200).json(savedObj);
        }
        
    } catch (err) {        
        response.status(400).json({'fehler': true, 'nachricht': 'Fehler im Service'});
    }
});

module.exports = serviceRouter;