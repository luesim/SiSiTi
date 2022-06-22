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

        var sql = 'SELECT * FROM Benutzer WHERE idBenutzer=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return result;
    }

    loadBySessionID(sessionID) {

        var sql = 'SELECT * FROM Benutzer WHERE sessionID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(sessionID);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by sessionID=' + sessionID);

        return result;
    }

    CheckName(name) {

        var sql = 'SELECT * FROM Benutzer WHERE ? NOT IN (SELECT name FROM Benutzer)';
        var statement = this._conn.prepare(sql);
        var result = statement.get(name);

        if (helper.isUndefined(result)) 
            throw new Error('User with name=' + name + ' exist');

        return result;
    }

    CheckEmail(email) {
        var sql = 'SELECT * FROM Benutzer WHERE ? NOT IN (SELECT email FROM Benutzer)';
        var statement = this._conn.prepare(sql);
        var result = statement.get(email);

        if (helper.isUndefined(result)) 
            throw new Error('User with email=' + email + ' exist');

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

    login(email = '', passwort = '') {
        var sql = 'SELECT * FROM Benutzer WHERE email=? AND passwort=?';
        var statement = this._conn.prepare(sql);
        var params = [email, md5(passwort)];
        var result = statement.get(params);

        if (helper.isUndefined(result)) 
            throw new Error('User with email=' + email + ' and passwort=' + passwort + 'doesnt exist');

        return result;
    }

    toString() {
        console.log('benutzerDao [_conn=' + this._conn + ']');
    }

    changePasswort(sessionID, neuespasswort='') { 
        
        var sql = 'UPDATE Benutzer SET passwort=? WHERE sessionID=?';
        var statement = this._conn.prepare(sql);
        var params = [md5(neuespasswort), sessionID];
    
    var result = statement.run(params);
        console.log(statement.run(params));
    if (result.changes != 1) 
        throw new Error('Could not update existing Record. Data: ' + params);

    console.log(this.loadBySessionID(sessionID));
    return this.loadBySessionID(sessionID);
    
}
    

    delete(id) {
        try {
            var sql = 'DELETE FROM Benutzer WHERE id=?'; //Erst Bilder oder geht alles gleichzeitig?
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);
                console.log(statement)
                console.log(result)
            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }
}

module.exports = benutzerDao;