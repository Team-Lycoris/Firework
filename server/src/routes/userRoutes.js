import {Router} from "express";
import { test, getGroups } from '../controller/userController.js'

const router = Router();

router.get('/getGroups/', getGroups);
router.get('/getMessages/:groupId', test);
router.post('/sendMessage/:groupId', test);

export default router;