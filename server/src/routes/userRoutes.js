import {Router} from "express";
import { test, getSelfInfo, createDM, getGroups, createGroup, 
    getMessages, sendMessage, sendFriendInvite, acceptFriendInvite, 
    getIncomingFriendInvites, getOutgoingFriendInvites } from '../controller/userController.js'

const router = Router();

router.get('/getSelfInfo/', getSelfInfo);
router.post('/createDM/', createDM);
router.get('/getGroups/', getGroups);
router.post('/createGroup/', createGroup);
router.get('/getMessages/:groupId', getMessages);
router.post('/sendMessage/:groupId', sendMessage);
router.post('/acceptFriendInvite/', acceptFriendInvite);
router.post('/sendFriendInvite/', sendFriendInvite);
router.get('/sendFriendInvite/', getIncomingFriendInvites);
router.get('/getOutgoingFriendInvites/', getOutgoingFriendInvites);

export default router;