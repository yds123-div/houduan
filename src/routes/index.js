import express from 'express';
import usersRouter from './users.router.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ name: 'subdub API', version: '1.0.0' });
});

router.use('/users', usersRouter);

export default router;
