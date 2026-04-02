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
  res.render('index', {
    pageTitle: '2AM Study - Focus Timer & Study Tools for Students',
    metaDescription: '2AM Study helps students stay focused with a productivity timer, study tools, study tips and routines to improve concentration and academic performance.',
  });
});

app.get('/focus-tips.html', (req, res) => {
  res.render('focus-tips', {
    pageTitle: 'Focus Tips - How to Stay Focused While Studying',
    metaDescription: 'Explore practical focus tips for students that improve concentration, study productivity, and effective learning habits while studying.',
  });
});

app.get('/pricing-plan.html', (req, res) => {
  res.render('pricing-plan', {
    pageTitle: 'Pricing Plan - Free Study Tools for Students',
    metaDescription: 'Discover all the free study tools available on 2AM Study, from timers and notes to quotes and streak tracking.',
  });
});

app.get('/study-routine.html', (req, res) => {
  res.render('study-routine', {
    pageTitle: 'Study Routine - Best Study Schedule for Students',
    metaDescription: 'Discover the best study routine for students with daily habits, focus strategies, and productivity tips to help you study smarter every day.',
  });
});

app.get('/study-at-night.html', (req, res) => {
  res.render('study-at-night', {
    pageTitle: 'Study at Night - How to Study at 2AM Effectively',
    metaDescription: 'Learn how to study at night with a smart 2AM study strategy, nighttime productivity tips, and ways to balance rest and deep focus.',
  });
});

app.get('/timer', (req, res) => {
  res.render('timer', { pageTitle: 'Pomodoro Timer' });
});

app.get('/tasks', (req, res) => {
  res.render('tasks', { pageTitle: 'Planner & Tasks' });
});

app.get('/flashcards', (req, res) => {
  res.render('flashcards', { pageTitle: 'Flashcards' });
});

app.get('/notes', (req, res) => {
  res.render('notes', { pageTitle: 'Download Study Notes' });
});

app.get('/chat', (req, res) => {
  res.render('chat', { pageTitle: 'Student Chat' });
});

app.get('/music', (req, res) => {
  res.render('music', { pageTitle: 'Focus Music' });
});

app.get('/quotes', (req, res) => {
  res.render('quotes', { pageTitle: 'Motivational Quotes' });
});

app.get('/game', (req, res) => {
  res.render('game', { pageTitle: 'Study Game' });
});

app.get('/calculator', (req, res) => {
  res.render('calculator', { pageTitle: 'Scientific Calculator' });
});

app.get('/clock', (req, res) => {
  res.render('clock', { pageTitle: 'Digital Clock' });
});

app.get('/streak', (req, res) => {
  res.render('streak', { pageTitle: 'Leaderboard & Streak' });
});

app.get('/college-student', (req, res) => {
  res.render('college-student', { pageTitle: 'College Student Support' });
});

app.get('/reminder', (req, res) => {
  res.render('reminder', { pageTitle: 'Reminder System' });
});

app.get('/distraction', (req, res) => {
  res.render('distraction', { pageTitle: 'Distraction Blocker' });
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
