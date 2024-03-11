import {Router} from "express";
import { test, getSelfInfo, createDM, getGroups, createGroup, getMessages, sendMessage } from '../controller/userController.js'

const router = Router();

router.get('/getSelfInfo/', getSelfInfo);
router.post('/createDM/', createDM);
router.get('/getGroups/', getGroups);
router.post('/createGroup/', createGroup);
router.get('/getMessages/:groupId', getMessages);
router.post('/sendMessage/:groupId', sendMessage);

export default router;