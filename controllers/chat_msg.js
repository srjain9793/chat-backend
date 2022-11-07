const executeQuery = require('../utils/execute_query');

async function createMsg(req, res) {
    try {
        //TODO add request validations
        let isMember = await isGroupMember(req.body.groupId, req.body.userId);
        if (isMember) {
            let result = await executeQuery(
                "INSERT INTO chat_msgs (group_id, msg_text, created_by) values (?,?,?)",
                [req.body.groupId, req.body.msg, req.body.userId]
            );
            if (result.insertId) {
                res.status(201).send({ status: "Success", message: "Message sent to group." });
            } else {
                res.status(400).send({ status: "Failed", message: 'Some error occurred' });
            }
        }else{
            res.status(400).send({ status: "Failed", message: 'Not Authorized to send message' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Failed", message: 'Internal server error' });
    }
}

async function getMessages(req, res) {
    try {
        let limit = parseInt(req.query.limit || 10);
        let offset = ((req.query.page || 1) - 1) * limit;
        let result = await executeQuery(
            `SELECT cm.group_id, cm.msg_text, cm.created_at, cm.created_by 
            FROM chat_msgs cm JOIN chat_group_members gm ON cm.group_id=gm.group_id            
            WHERE cm.group_id=1 AND gm.member_id=1`,
            [req.body.groupId, req.body.userId]
        );
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send([]);
    }
}

async function isGroupMember(groupId, userId) {
    let result = await executeQuery(
        `SELECT is_member FROM chat_group_members WHERE is_member=1 AND group_id=? AND member_id=?`,
        [groupId, userId]
    );
    return result.length > 0;
}

module.exports = { createMsg, getMessages }