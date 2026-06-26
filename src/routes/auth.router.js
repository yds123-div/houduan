import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

// 认证相关接口（脚手架阶段，暂返回占位数据）
router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/sign-out', authController.signOut);

export default router;
