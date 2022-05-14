const helper = require('../helper.js');
const md5 = require('md5');

class bildDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadByIdBenutzer(id) {
        var sql = 'SELECT * FROM bild WHERE idBenutzer=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by idBild=' + id);

        result.DATUM = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result.DATUM));

        return result;
    }

    create(idbild = "", idBenutzer = "", bildpfad = null, bildname = '', aufloesung = '', bildtyp = '', datum = null) {
        var sql = 'INSERT INTO bild (idBild,idBenutzer,bildpfad,bildname,aufloesung,bildtyp,datum) VALUES (?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [ idbild, idBenutzer, bildpfad, bildname, aufloesung, bildtyp, helper.formatToSQLDateTime(datum)];
        var result = statement.run(params);
        
        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadByIdBenutzer(idBenutzer);
    }
}

module.exports = bildDao;