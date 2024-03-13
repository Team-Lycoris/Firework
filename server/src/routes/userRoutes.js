import {Router} from "express";
import { test, getSelfInfo, createDM, getGroups, createGroup,
    getMessages, sendMessage, sendFriendInvite, acceptFriendInvite,
    getIncomingFriendInvites, getOutgoingFriendInvites, declineFriendInvite, addUserToGroup } from '../controller/userController.js'

const router = Router();

router.get('/getSelfInfo/', getSelfInfo);
router.post('/createDM/', createDM);
router.get('/getGroups/', getGroups);
router.post('/createGroup/', createGroup);
router.get('/getMessages/:groupId', getMessages);
router.post('/sendMessage/:groupId', sendMessage);
router.post('/acceptFriendInvite/', acceptFriendInvite);
router.post('/declineFriendInvite/', declineFriendInvite);
router.post('/sendFriendInvite/', sendFriendInvite);
router.get('/sendFriendInvite/', getIncomingFriendInvites);
router.get('/getOutgoingFriendInvites/', getOutgoingFriendInvites);
router.post('/addUserToGroup/', addUserToGroup);

export default router;
