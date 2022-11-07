const executeQuery = require('../utils/execute_query');

async function getMostActiveUsers(req, res) {
    try {
        let startDate = req.query.startDate || '1900-01-01';
        let endDate = req.query.endDate || new Date();
        let result = await executeQuery(`
            SELECT u.id, u.name, SHA1(msg_text) AS msg FROM chat_msgs t1
            JOIN (SELECT COUNT(*) c, created_by FROM chat_msgs
            WHERE created_at BETWEEN ? AND ?
            GROUP BY created_by ORDER BY c DESC LIMIT 5) t ON t.created_by = t1.created_by
            JOIN users u ON t.created_by=u.id
    `, [startDate, endDate])
        let out = {};
        result.forEach(e => {
            if (!out[e.id]) out[e.id] = { name: e.name, messages: [] };
            out[e.id].messages.push(e.msg)
        });
        out = Object.values(out);
        res.status(200).send(out);

    } catch (error) {
        res.status(500).send('Internal server error');

    }
}

async function getMostActiveChats(req, res) {
    try {
        let startDate = req.query.startDate || '1900-01-01';
        let endDate = req.query.endDate || new Date();
        let result = await executeQuery(`
        SELECT SHA1(msg_text) AS msg, u.grp_name, u.grp_id, c FROM chat_msgs t1
        JOIN (SELECT COUNT(*) c, group_id FROM chat_msgs WHERE created_at BETWEEN ? AND ?
        GROUP BY group_id ORDER BY c DESC LIMIT 5) t ON t.group_id = t1.group_id
        JOIN chat_groups u ON t.group_id=u.grp_id
        ;
    `, [startDate, endDate])
        let out = {};
        result.forEach(e => {
            if (!out[e.id]) out[e.id] = { groupName: e.grp_name, messages: [] };
            out[e.id].messages.push(e.msg)
        });
        out = Object.values(out);
        res.status(200).send(out);

    } catch (error) {
        res.status(500).send('Internal server error');

    }
}

module.exports = { getMostActiveUsers, getMostActiveChats }