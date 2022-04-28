const helper = require('../helper.js');
//const nutzerDao = require('../dao/nutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Nutzer');


serviceRouter.post('/Signin', function(request,response){
    console.log('Service Router: Client requested creation of new User!')
    
});
