const express = require('express')
const router = express.Router()
const { signUp, getUsers } = require('./controllers/users');
const { createGroup, getGroups, addMemberGroup, updateGrp } = require('./controllers/chat_groups');
const { createMsg, getMessages } = require('./controllers/chat_msg');
const { updateGroupMember } = require('./controllers/group_members');
const { getMostActiveUsers, getMostActiveChats } = require('./controllers/analytics');

router.post('/user/signup', signUp);
router.get('/users', getUsers);

router.post('/group', createGroup);
router.get('/groups/:userId', getGroups);
router.patch('/group', updateGrp);

router.post('/group/member', updateGroupMember);

router.post('/message/create', createMsg);
router.post('/message/get', getMessages);

router.get('/activeusers', getMostActiveUsers);
router.get('/activechats', getMostActiveChats);

module.exports = router