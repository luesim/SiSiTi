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
    loadKategorieIdbyBildId(idBild=''){
        var sql = 'SELECT * FROM kategorie inner join bild2kategorie on kategorie.IDKATEGORIE=bild2kategorie.IDKATEGORIE WHERE bild2kategorie.idBild=?';
        var statement = this._conn.prepare(sql);
        //var result = statement.get(idBild);
        var result = statement.all(idBild);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by idBild=' + id);
        result.DATUM = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result.DATUM));

        return result
}
    loadByKategoriename(Kategoriename=''){
        var sql = 'SELECT BILD.IDBILD, BILD.BILDPFAD, BILD.BILDNAME, BILD.AUFLOESUNG FROM BILD inner join BILD2KATEGORIE ON BILD.IDBILD=BILD2KATEGORIE.IDBILD inner join KATEGORIE ON BILD2KATEGORIE.IDKATEGORIE=KATEGORIE.IDKATEGORIE WHERE KATEGORIE.BEZEICHNUNG =?';
        var statement = this._conn.prepare(sql);
        //var result = statement.get(Kategoriename);
        var result = statement.all(Kategoriename);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by idBild=' + id);
        result.DATUM = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result.DATUM));

        return result
}
}

module.exports = bildToKategorieDao;