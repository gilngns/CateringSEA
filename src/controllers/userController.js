import User from '../models/userModel.js';

const userController = {
  index: async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  },
  show: async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
  },
  create: async (req, res) => {
    await User.create(req.body);
    res.status(201).json({ message: 'User created' });
  },
  update: async (req, res) => {
    await User.update(req.params.id, req.body);
    res.json({ message: 'User updated' });
  },
  delete: async (req, res) => {
    await User.delete(req.params.id);
    res.json({ message: 'User deleted' });
  }
};

export default userController;
