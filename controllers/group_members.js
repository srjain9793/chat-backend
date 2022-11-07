const executeQuery = require('../utils/execute_query');

async function updateGroupMember(req, res) {
    try {
        let s = req.body.add == 1 ? 'add' : 'remov';
        //TODO add request validations
        let out = { statusCode: 400, status: "Failed", message: "Some error occurred" };

        if (req.body.userId == req.body.memberId) {
            out.message = 'Invalid request';
        } else {
            let { isOwner, isNew } = await isGroupOwner(req.body.groupId, req.body.userId, req.body.memberId, req.body.add);
            if (isOwner) {
                let result = {};
                if (isNew) {
                    result = await addMember(req.body.groupId, req.body.memberId, 1, 0);
                } else {
                    result = await updateMember(req.body.groupId, req.body.memberId, req.body.add == 1 ? 1 : 0);
                }

                if (result.insertId || result.affectedRows) {
                    out = { statusCode: 201, status: 'Success', message: `Member ${s}ed.` };
                }
            } else if (!isOwner) {
                out.message = `You are not authorized to ${s} member`;
            } else if (!notAmember) {
                out.message = 'Memeber already added to the group';
            }
        }

        res.status(out.statusCode).send({ status: out.status, message: out.message });
    } catch (error) {
        console.log(error.sql);
        res.status(500).send({ status: "Failed", message: 'Internal server error' });
    }
}

async function addMember(groupId, memberIds, isMember, isAdmin) {
    let result = await executeQuery(
        'INSERT INTO chat_group_members (group_id, member_id, is_member, is_admin) VALUES (?, ?, ?, ?)',
        [groupId, memberIds, isMember, isAdmin]
    );
    return result;
}
async function updateMember(groupId, memberIds, isMember) {
    let result = await executeQuery(
        'UPDATE chat_group_members SET is_member=? WHERE group_id=? AND member_id=?',
        [isMember, groupId, memberIds]
    );
    return result;
}

async function isGroupOwner(groupId, userId, memberId, toAdd) {
    let result = await executeQuery(
        `SELECT group_id, member_id, 
        (CASE WHEN (member_id=? AND is_admin=1) THEN 1 ELSE 0 END) AS isAdmin 
        FROM chat_group_members
        WHERE member_id IN (?,?) AND group_id = ?
        `,
        [userId, userId, memberId, groupId]
    );
    let isOwner = (result.filter(r => r.isAdmin == 1)[0] || {})['isAdmin'];
    return { isOwner, isNew: result.length == 1 };
}

module.exports = { updateGroupMember, addMember }