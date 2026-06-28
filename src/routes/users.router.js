import express from 'express';
import { list, get, create, update, remove } from '../controllers/user.controller.js';
import protect, { authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 获取所有用户：需登录且为管理员（protect 验证身份 -> authorizeAdmin 校验角色 -> list）
router.get('/', protect, authorizeAdmin, list);
// 获取用户详情：需登录（get 内部再做所有权检查，普通用户只能查自己）
router.get('/:id', protect, get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
