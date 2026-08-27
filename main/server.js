const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ให้ Express ให้บริการไฟล์ static ทั้งหมดในโฟลเดอร์ main
app.use(express.static(__dirname));

// เมื่อเข้า localhost:3000 ให้เปิด index.html เป็นหน้าแรก
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// สร้าง/เปิดไฟล์ฐานข้อมูลในเครื่อง
const db = new sqlite3.Database('./restaurant.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to local SQLite database (restaurant.db)');
  }
});

// สร้างตาราง users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    birthday TEXT,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API: สมัครสมาชิก (Register)
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, email, phone, birthday, password } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (firstname, lastname, email, phone, birthday, password) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [firstname, lastname, email, phone, birthday, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'อีเมลนี้ถูกใช้งานไปแล้ว' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการประมวลผล' });
  }
});

// API: เข้าสู่ระบบ (Login)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'ไม่พบบัญชีผู้ใช้นี้' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        phone: user.phone
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});