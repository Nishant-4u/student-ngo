const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-email', async (req, res) => {
  const { name, email, phone, formName } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' });
  }

  const mailOptions = {
    from: `Website Contact <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
    subject: `New form submission: ${formName || 'Contact Form'}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
    html: `
      <p><strong>Form:</strong> ${formName || 'Contact Form'}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ message: '🎉 Thanks for registering! We’re excited to have you with us.' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
