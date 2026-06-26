import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.list);
router.get('/:id', userController.get);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;
