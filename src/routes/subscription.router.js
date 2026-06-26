import express from 'express';
import subscriptionController from '../controllers/subscription.controller.js';

const router = express.Router();

// 订阅相关接口（脚手架阶段，暂返回占位数据）
// 注意：固定路径须排在动态 /:id 之前，否则会被当成 id 参数匹配
router.get('/', subscriptionController.list);
router.get('/upcoming-renewals', subscriptionController.upcomingRenewals);
router.get('/user/:id', subscriptionController.listByUser);
router.get('/:id', subscriptionController.get);
router.post('/', subscriptionController.create);
router.put('/:id/cancel', subscriptionController.cancel);
router.put('/:id', subscriptionController.update);
router.delete('/:id', subscriptionController.remove);

export default router;
