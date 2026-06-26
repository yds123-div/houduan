import express from 'express';
import usersRouter from './users.router.js';
import authRouter from './auth.router.js';
import subscriptionRouter from './subscription.router.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ name: 'subdub API', version: '1.0.0' });
});

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/subscriptions', subscriptionRouter);

export default router;
