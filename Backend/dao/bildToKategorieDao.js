const helper = require('../helper.js');

class bildToKategorieDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    create(idBild='',idKategorie='') {
        var sql = 'INSERT INTO bild2kategorie (idBild,idKategorie) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [idBild,idKategorie];
        var result = statement.run(params);
        
        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);
        return;
    }
}

module.exports = bildToKategorieDao;