import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  list,
  get,
  createSubscription,
  update,
  remove,
  listByUser,
  cancel,
  upcomingRenewals,
} from '../controllers/subscription.controller.js';

const router = express.Router();

// 订阅相关接口（脚手架阶段，暂返回占位数据）
// 注意：固定路径须排在动态 /:id 之前，否则会被当成 id 参数匹配
router.get('/', list);
router.get('/upcoming-renewals', upcomingRenewals);
router.get('/user/:id', listByUser);
router.get('/:id', get);
// 创建订阅需要登录：先过 protect 拿到 req.user，再进 controller
router.post('/', protect, createSubscription);
router.put('/:id/cancel', cancel);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
