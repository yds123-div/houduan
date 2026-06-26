import express from 'express';
import subscriptionController from '../controllers/subscription.controller.js';

const router = express.Router();

// 订阅相关接口
router.get('/', subscriptionController.list);
router.get('/:id', subscriptionController.get);
router.post('/', subscriptionController.create);
router.put('/:id', subscriptionController.update);
router.delete('/:id', subscriptionController.remove);

export default router;
