const helper = require('../helper.js');
const md5 = require('md5');

class benutzerDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {

        var sql = 'SELECT sessionID FROM Benutzer WHERE idBenutzer=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return result;
    }

    create(idBenutzer = null, name = '', email = '', passwort = '', sessionID = null) {
        var sql = 'INSERT INTO Benutzer (idBenutzer,name,email,passwort,sessionID) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [idBenutzer, name, email, md5(passwort), sessionID];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(idBenutzer);
    }

    toString() {
        console.log('benutzerDao [_conn=' + this._conn + ']');
    }
}

module.exports = benutzerDao;