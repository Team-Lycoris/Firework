import {Router} from "express";
import { test } from '../controller/userController.js'

const router = Router();

router.post('/test', test);


export default router;