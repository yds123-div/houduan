import { register, login } from '../services/auth.service.js';

export default {
  register: async (req, res, next) => {
    try {
      const user = await register(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await login(req.body);
      if (!result) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
