const express = require('express');
const nodemailer = require('nodemailer');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable Compression for all responses
app.use(compression());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Optimized Static Asset Caching (7 Days)
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
    etag: true,
    lastModified: true
}));

// Route for ads.txt at the root
app.get('/ads.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../ads.txt'));
});

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



app.get('/timer', (req, res) => {
  res.render('timer', { 
    pageTitle: 'Best Pomodoro Timer for Students - Focus & Study More',
    metaDescription: 'Boost your study focus with our aesthetic Pomodoro timer. Custom work/break intervals, distraction blocking, and progress tracking for students.'
  });
});

app.get('/tasks', (req, res) => {
  res.render('tasks', { 
    pageTitle: 'Academic Planner & Task Manager - Student GPA Booster',
    metaDescription: 'Organize your assignments, exams, and daily study goals with our free task planner. Stay consistent and never miss a deadline.'
  });
});

app.get('/flashcards', (req, res) => {
  res.render('flashcards', { 
    pageTitle: 'Online Flashcard Maker - Study Smarter with Digital Cards',
    metaDescription: 'Create, flip, and manage digital flashcards for fast memorization. The ultimate study tool for exam prep and vocabulary building.'
  });
});

app.get('/notes', (req, res) => {
  res.render('notes', { 
    pageTitle: 'Download Free Study Notes & Academic PDFs',
    metaDescription: 'Access a curated collection of student notes, guides, and study materials in PDF format. Download for free and excel in your exams.'
  });
});

app.get('/chat', (req, res) => {
  res.render('chat', { 
    pageTitle: 'Student Community Chat - Connect & Study Together',
    metaDescription: 'Join a vibrant community of students. Discuss study tips, share resources, and find study buddies in our moderated chat room.'
  });
});

app.get('/music', (req, res) => {
  res.render('music', {
    pageTitle: 'Lofi Study Music - Best Focus & Concentration Beats',
    metaDescription: 'Listen to curated focus music, lofi beats, and ambient sounds designed to help students concentrate and reach deep work states.',
    youtubeApiKey: process.env.YOUTUBE_API_KEY || ''
  });
});

app.get('/quotes', (req, res) => {
  res.render('quotes', { 
    pageTitle: 'Motivational Study Quotes - Get Inspired Daily',
    metaDescription: 'Collection of aesthetic motivational quotes for students. Export to custom backgrounds to keep yourself inspired throughout the semester.'
  });
});

app.get('/game', (req, res) => {
  res.render('game', { 
    pageTitle: 'Study Reward Games - Fun Challenges for Productive Students',
    metaDescription: 'Unlock fun, focus-enhancing games as a reward for completing your study sessions. The perfect way to recharge between tasks.'
  });
});

app.get('/calculator', (req, res) => {
  res.render('calculator', { 
    pageTitle: 'Scientific Calculator Online - Fast & Free for Students',
    metaDescription: 'Simple and powerful online scientific calculator for solving math, physics, and engineering problems during your study sessions.'
  });
});

app.get('/clock', (req, res) => {
  res.render('clock', { 
    pageTitle: 'Digital Study Clock - Full-Screen Time Management',
    metaDescription: 'Minimalist full-screen digital clock to keep you aware of time during focused study sessions. Aesthetic and distraction-free.'
  });
});

app.get('/streak', (req, res) => {
  res.render('streak', { 
    pageTitle: 'Study Streak Tracker & Leaderboard - Gamify Your Grades',
    metaDescription: 'Track your daily study consistency and compete on the global leaderboard. Build powerful habits through study streaks.'
  });
});

app.get('/college-student', (req, res) => {
  res.render('college-student', { 
    pageTitle: 'College Student Support - Mental Health & Academic Help',
    metaDescription: 'Resources and support for navigating college life. From emotional wellness to academic guidance, we’re here for you.'
  });
});

app.get('/reminder', (req, res) => {
  res.render('reminder', { 
    pageTitle: 'Smart Study Reminders - Never Forget a Session',
    metaDescription: 'Set persistent time-based alerts and notifications to keep your study routine on track. Manage your time effectively.'
  });
});

app.get('/distraction', (req, res) => {
  res.render('distraction', { 
    pageTitle: 'Distraction Blocker - Stay Focused on Your Page',
    metaDescription: 'Prevent accidental tab-surfing and social media distractions with our built-in blocker. Maintain deep focus for longer.'
  });
});

// --- Core Pages ---
app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', { pageTitle: 'Privacy Policy' });
});
app.get('/about', (req, res) => {
  res.render('about', { pageTitle: 'About Us' });
});
app.get('/contact', (req, res) => {
  res.render('contact', { pageTitle: 'Contact Us' });
});

// --- Blog Section ---
app.get('/blog', (req, res) => {
  res.render('blog/index', { pageTitle: 'Read Our Blog' });
});
app.get('/blog/how-to-stay-focused', (req, res) => {
  res.render('blog/how-to-stay-focused', { pageTitle: 'How to stay focused while studying' });
});
app.get('/blog/best-study-techniques', (req, res) => {
  res.render('blog/best-study-techniques', { pageTitle: 'Best study techniques for students' });
});
app.get('/blog/avoid-distraction', (req, res) => {
  res.render('blog/avoid-distraction', { pageTitle: 'How to avoid distraction while studying' });
});
app.get('/blog/daily-study-routine', (req, res) => {
  res.render('blog/daily-study-routine', { pageTitle: 'Daily study routine for success' });
});
app.get('/blog/build-consistency', (req, res) => {
  res.render('blog/build-consistency', { pageTitle: 'How to build consistency in study' });
});
app.get('/blog/no-motivation-2am-study', (req, res) => {
  res.render('blog/no-motivation-2am-study', { 
    pageTitle: 'No Motivation? Start 2AM Study With Me',
    metaDescription: 'Learn how to overcome a lack of study motivation with our actionable 2AM strategy and focus tools.'
  });
});

app.get('/blog/focus-tips', (req, res) => {
  res.render('blog/focus-tips', {
    pageTitle: 'Focus Tips - How to Stay Focused While Studying',
    metaDescription: 'Explore practical focus tips for students that improve concentration, study productivity, and effective learning habits while studying.',
  });
});

app.get('/blog/study-routine-guide', (req, res) => {
  res.render('blog/study-routine-guide', {
    pageTitle: 'Study Routine Guide - Best Study Schedule for Students',
    metaDescription: 'Discover the best study routine for students with daily habits, focus strategies, and productivity tips.',
  });
});

app.get('/blog/study-at-night', (req, res) => {
  res.render('blog/study-at-night', {
    pageTitle: 'Study at Night - How to Study at 2AM Effectively',
    metaDescription: 'Learn how to study at night with a smart 2AM study strategy, nighttime productivity tips, and ways to balance rest.',
  });
});

// --- Study Tools ---
app.get('/study-tools', (req, res) => {
  res.render('tools/index', { pageTitle: 'Study Tools Hub' });
});

app.get('/exam-countdown', (req, res) => {
  res.render('tools/exam-countdown', { pageTitle: 'Exam Countdown' });
});
app.get('/syllabus-tracker', (req, res) => {
  res.render('tools/syllabus-tracker', { pageTitle: 'Syllabus Tracker' });
});
app.get('/timetable-generator', (req, res) => {
  res.render('tools/timetable-generator', { pageTitle: 'Study Timetable Generator' });
});

// --- Calculators ---
app.get('/calculators', (req, res) => {
  res.render('calculators/index', { pageTitle: 'Calculators Hub' });
});
app.get('/calculators/cgpa', (req, res) => {
  res.render('calculators/cgpa', { pageTitle: 'CGPA Calculator' });
});
app.get('/calculators/percentage', (req, res) => {
  res.render('calculators/percentage', { pageTitle: 'Percentage Calculator' });
});
app.get('/calculators/age', (req, res) => {
  res.render('calculators/age', { pageTitle: 'Age Calculator' });
});

// --- Utilities ---
app.get('/utilities', (req, res) => {
  res.render('utilities/index', { 
    pageTitle: 'Student Utility Hub - Free AQI, Grammar & Word Tools',
    metaDescription: 'Collection of essential digital utilities for students: Air Quality indexes, Grammar checkers, Word counters, and more.'
  });
});

app.get('/weather', (req, res) => {
  res.render('utilities/weather', { 
    pageTitle: 'Local Weather Tracker - Plan Your Campus Commute',
    metaDescription: 'Get real-time weather updates and 7-day forecasts. Essential for students planning their daily campus travels.'
  });
});

app.get('/compass', (req, res) => {
  res.render('utilities/compass', { 
    pageTitle: 'Digital Compass Online - Easy Direction Finder',
    metaDescription: 'Reliable in-browser digital compass. Useful for student orientation and outdoor academic trips.'
  });
});

app.get('/word-counter', (req, res) => {
  res.render('utilities/word-counter', { 
    pageTitle: 'Free Word & Character Counter - Writing Tool for Essays',
    metaDescription: 'Accurately count words, characters, and sentences. Ideal for meeting essay word counts and document formatting.'
  });
});

app.get('/grammar-checker', (req, res) => {
  res.render('utilities/grammar-checker', { 
    pageTitle: 'Free AI Grammar Checker - Polish Your Student Essays',
    metaDescription: 'Instantly find and fix grammar, spelling, and punctuation errors. Ensure your academic work is professional and error-free.'
  });
});

app.get('/air-quality', (req, res) => {
  res.render('utilities/air-quality', { 
    pageTitle: 'Real-time Air Quality & AQI Checker for Students',
    metaDescription: 'Monitor local air pollution levels. Health-focused insights for students and commuters based on real-time sensor data.'
  });
});

// --- PDF Tools ---

app.get('/pdf-tools/maker', (req, res) => {
  res.render('pdf-tools/maker', { 
    pageTitle: 'Online PDF Maker - Convert Images & Text to PDF',
    metaDescription: 'Create high-quality PDF documents from images or text. Fast, secure, and perfect for organizing study notes.'
  });
});

app.get('/pdf-tools/merger', (req, res) => {
  res.render('pdf-tools/merger', { 
    pageTitle: 'Merge PDF Online - Combine Multiple PDFs Fast',
    metaDescription: 'Join several PDF files into one neatly organized document. Perfect for combining multiple assignment parts or research papers.'
  });
});

app.get('/pdf-tools/splitter', (req, res) => {
  res.render('pdf-tools/splitter', { 
    pageTitle: 'Split PDF Online - Extract Pages from Any PDF',
    metaDescription: 'Extract specific pages or separate one large PDF into individual files. Ideal for managing massive academic textbooks.'
  });
});

app.get('/pdf-tools/editor', (req, res) => {
  res.render('pdf-tools/editor', { 
    pageTitle: 'Free PDF Editor - Annotate & Draw on PDFs Online',
    metaDescription: 'Highlight text, add annotations, and draw directly on your PDFs. The essential tool for digital note-taking.'
  });
});

app.get('/pdf-tools/compressor', (req, res) => {
  res.render('pdf-tools/compressor', { 
    pageTitle: 'PDF Compressor - Reduce File Size for Easy Sharing',
    metaDescription: 'Shrink your large PDF documents without losing quality. Perfect for emailing assignments or uploading to portals with size limits.'
  });
});

app.get('/pdf-tools/converter', (req, res) => {
  res.render('pdf-tools/converter', { 
    pageTitle: 'PDF Converter - Change Formats Quickly & Easily',
    metaDescription: 'Convert common document formats to and from PDF. Flexible file management for all your student projects.'
  });
});

app.post('/send-email', async (req, res) => {
  const { formName } = req.body;

  // Build key-value list from body
  let bodyContent = '';
  let htmlContent = `<p><strong>Form:</strong> ${formName || 'Contact Form'}</p>`;
  
  for (const [key, value] of Object.entries(req.body)) {
    if (key !== 'formName') {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      bodyContent += `${capitalizedKey}: ${value}\n`;
      htmlContent += `<p><strong>${capitalizedKey}:</strong> ${value}</p>`;
    }
  }

  const mailOptions = {
    from: `Website Contact <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
    subject: `New form submission: ${formName || 'Contact Form'}`,
    text: bodyContent,
    html: htmlContent,
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
