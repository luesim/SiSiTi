const helper = require('../helper.js');

class kategorieDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadByKategorieBezeichnung(bezeichnung) {
        var sql = 'SELECT * FROM kategorie WHERE bezeichnung=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(bezeichnung);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by idBild=' + id);

        return result;
    }

    create(idKategorie="",bezeichnung="") {
        var sql = 'INSERT INTO kategorie (idKategorie,bezeichnung) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [idKategorie,bezeichnung];
        var result = statement.run(params);
        
        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadByKategorieBezeichnung(bezeichnung);
    }
}

module.exports = kategorieDao;