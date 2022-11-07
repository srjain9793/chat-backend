const executeQuery = require('../utils/execute_query');

async function signUp(req, res) {
    try {
        //TODO add request validations

        let result = await executeQuery("INSERT INTO users (name, email) values (?,?)", [req.body.name, req.body.email]);
        if (result.insertId) {
            res.status(201).send({ status: "Success", message: "User created." });
        } else {
            res.status(400).send({ status: "Failed", message: 'Some error occurred' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Failed", message: 'Internal server error' });
    }
}

async function getUsers(req, res) {
    try {
        let limit = parseInt(req.query.limit || 10);
        let offset = ((req.query.page || 1) - 1) * limit;
        let result = await executeQuery("SELECT id, name, email FROM users LIMIT ? OFFSET ?", [limit, offset]);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send([]);
    }
}

module.exports = { signUp, getUsers }