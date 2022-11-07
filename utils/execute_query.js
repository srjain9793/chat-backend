const dbConn = require('../dbconn');
module.exports = (qryStr, values) => {
    return new Promise((resolve, reject) => {
        dbConn.query(qryStr, values, (error, result) => {
            if (error) {
                console.log(error)
                reject({ message: 'Internal Error' });
            } else {
                resolve(result);
            }
        });
    })
}