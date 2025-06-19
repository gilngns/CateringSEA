import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

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
    try {
      const { full_name, email, password } = req.body;

      // 🔐 Cek email sudah terdaftar atau belum
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Registrasi gagal. Silakan coba email lain.' });
      }

      // 🔒 Enkripsi password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🧠 Tentukan role berdasarkan email
      const role = email === 'admin@gmail.com' ? 'ADMIN' : 'USER';

      // 💾 Simpan user baru
      const [id] = await User.create({
        full_name,
        email,
        password: hashedPassword,
        role,
      });

      // 🎟️ Buat token JWT
      const token = jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      // ✅ Respon sukses
      res.status(201).json({ message: 'User created', token });

    } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({ error: 'Something went wrong during registration' });
    }
  },
  
  update: async (req, res) => {
    await User.update(req.params.id, req.body);
    res.json({ message: 'User updated' });
  },
  delete: async (req, res) => {
    await User.delete(req.params.id);
    res.json({ message: 'User deleted' });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Email tidak ditemukan' });
  
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });
  
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
  
    res.status(200).json({
      message: 'Login berhasil',
      token
    });
  }
  
};

export default userController;
