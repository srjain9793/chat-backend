const executeQuery = require('../utils/execute_query');
const { addMember } = require('./group_members');

async function createGroup(req, res) {
    try {
        //TODO add request validations

        let result = await executeQuery("INSERT INTO chat_groups (grp_name, grp_createdby) values (?,?)", [req.body.groupName, req.body.userId]);
        if (result.insertId) {
            await addMember(result.insertId, req.body.userId, 1, 1);
            res.status(201).send({ status: "Success", message: "Group created." });
        } else {
            res.status(400).send({ status: "Failed", message: 'Some error occurred' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Failed", message: 'Internal server error' });
    }
}

async function getGroups(req, res) {
    try {
        let limit = parseInt(req.query.limit || 10);
        let offset = ((req.query.page || 1) - 1) * limit;
        let result = await executeQuery(
            `SELECT * FROM chat_groups JOIN chat_group_members ON grp_id=group_id
            WHERE is_member=1 AND member_id=? LIMIT ? OFFSET ?`, [req.params.userId, limit, offset]);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send([]);
    }
}

async function updateGrp(req, res) {
    try {
        //TODO add request validations

        let result = await executeQuery(
            "UPDATE chat_groups SET grp_name=? WHERE grp_id=? AND grp_createdby=?",
            [req.body.groupName, req.body.groupId, req.body.userId]);

        if (result.affectedRows) {
            res.status(201).send({ status: "Success", message: "Group updated." });
        } else {
            res.status(400).send({ status: "Failed", message: 'Some error occurred' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Failed", message: 'Internal server error' });
    }
}
module.exports = { createGroup, getGroups, updateGrp }