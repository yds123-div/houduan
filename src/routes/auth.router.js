import express from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controller.js';

const router = express.Router();

// 认证相关接口（脚手架阶段，暂返回占位数据）
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);

export default router;
