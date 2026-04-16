const express = require('express');
const nodemailer = require('nodemailer');
const compression = require('compression');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const STORE_PRODUCTS = [
  { id:101, cat:'notebooks', emoji:'📓', badge:'top', badgeLabel:'2 AM Edition', name:'Notebook', desc:'Signature everyday notebook from 2 AM Study with smooth ruled pages for focused class notes.', price:199, orig:299 },
  { id:102, cat:'notebooks', emoji:'📔', badge:'hot', badgeLabel:'Hot', name:'Diary', desc:'Premium diary by 2 AM Study for journaling goals, daily reflection, and planning your productivity streak.', price:249, orig:399 },
  { id:103, cat:'notebooks', emoji:'🗒️', badge:'new', badgeLabel:'New', name:'Spiral Notebook Set', desc:'Spiral notebook combo pack for multiple subjects and long study sessions.', price:399, orig:599 },
  { id:201, cat:'bottles', emoji:'💧', badge:'top', badgeLabel:'Best Seller', name:'Insulated Water Bottle', desc:'Double-wall insulated bottle to keep water cool and support all-day hydration.', price:449, orig:699 },
  { id:202, cat:'bottles', emoji:'🍱', badge:'new', badgeLabel:'New', name:'Insulated Lunch Box', desc:'Compact insulated lunch box for students on campus and coaching days.', price:549, orig:799 },
  { id:203, cat:'bottles', emoji:'☕', badge:'hot', badgeLabel:'2 AM Study', name:'Coffee Mug', desc:'Aesthetic mug for chai or coffee during late-night focus hours.', price:299, orig:449 },
  { id:301, cat:'bags', emoji:'🎒', badge:'top', badgeLabel:'Top Pick', name:'College Backpack', desc:'Spacious and durable backpack for books, laptop, and daily student essentials.', price:1299, orig:1899 },
  { id:302, cat:'bags', emoji:'🧳', badge:'sale', badgeLabel:'Sale', name:'Travel Backpack', desc:'Multi-purpose travel backpack designed for short trips, classes, and weekend plans. Co-branded by 2 AM Study.', price:1499, orig:2299 },
  { id:401, cat:'essentials', emoji:'🖊️', badge:'top', badgeLabel:'Best Seller', name:'Premium Pen Set', desc:'Smooth-flow premium pens for clean handwriting and exam-ready notes.', price:199, orig:299 },
  { id:402, cat:'essentials', emoji:'🖍️', badge:'hot', badgeLabel:'Hot', name:'Highlighter Set', desc:'Bright and pastel highlighters to mark key concepts quickly.', price:179, orig:279 },
  { id:403, cat:'essentials', emoji:'📌', badge:null, badgeLabel:'', name:'Sticky Notes Pack', desc:'Sticky notes pack for reminders, formulas, and revision tags.', price:149, orig:229 },
  { id:404, cat:'essentials', emoji:'🗂️', badge:'new', badgeLabel:'New', name:'Desk Organizer Kit', desc:'Desk organizer kit to keep pens, notes, and supplies neatly arranged.', price:499, orig:749 },
  { id:405, cat:'essentials', emoji:'💡', badge:'top', badgeLabel:'Top Pick', name:'LED Study Lamp', desc:'Adjustable LED lamp with eye-comfort lighting for long study routines.', price:699, orig:999 },
  { id:406, cat:'essentials', emoji:'🔦', badge:'new', badgeLabel:'New', name:'Compact Study Lamp', desc:'Portable compact lamp for hostel desks and bedside study corners.', price:549, orig:799 },
  { id:407, cat:'essentials', emoji:'⏰', badge:null, badgeLabel:'', name:'Aesthetic Desk Clock', desc:'Minimal desk clock to manage pomodoro cycles and class schedules.', price:399, orig:599 },
  { id:408, cat:'essentials', emoji:'👕', badge:'hot', badgeLabel:'2 AM Edition', name:'T-Shirt (Unisex)', desc:'Soft, comfortable unisex T-shirt with 2 AM Study brand print.', price:599, orig:899 },
  { id:409, cat:'essentials', emoji:'🧥', badge:'sale', badgeLabel:'Sale', name:'Hoodie (Unisex)', desc:'Warm and stylish hoodie perfect for winter classes and late-night study, by 2 AM Study.', price:1199, orig:1699 },
  { id:410, cat:'essentials', emoji:'🎀', badge:null, badgeLabel:'', name:'Hair Scrunchie Set', desc:'Aesthetic scrunchie set with comfortable hold for daily use.', price:149, orig:249 },
  { id:411, cat:'essentials', emoji:'🚨', badge:'new', badgeLabel:'New', name:'Safety Alarm Keychain', desc:'Personal alarm keychain for added confidence during commute.', price:299, orig:449 },
  { id:412, cat:'essentials', emoji:'🔦', badge:null, badgeLabel:'', name:'Night Safety Flashlight', desc:'Compact flashlight for hostels, travel, and emergency use.', price:249, orig:379 },
  { id:413, cat:'essentials', emoji:'🎁', badge:'hot', badgeLabel:'Gift', name:'Birthday Surprise Box', desc:'Curated birthday gift box with 2 AM Study goodies and notes.', price:999, orig:1499 },
  { id:414, cat:'essentials', emoji:'💝', badge:'new', badgeLabel:'2 AM Study', name:'Birthday Memory Kit', desc:'Memory kit to preserve photos, messages, and celebration moments.', price:799, orig:1199 },
  { id:415, cat:'essentials', emoji:'🖼️', badge:null, badgeLabel:'', name:'Motivational Wall Poster', desc:'Inspirational wall poster to keep your study space energetic.', price:199, orig:299 },
  { id:416, cat:'essentials', emoji:'🧰', badge:'top', badgeLabel:'Best Value', name:'Compact Study Essentials Kit', desc:'All-in-one compact essentials kit from 2 AM Study for school, college, and self-study.', price:899, orig:1299 },
];
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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
    pageTitle: '2AM Study - #1 Student Productivity Hub, Focus Timer & Study Tips',
    metaDescription: 'Boost your student productivity with 2AM Study. Use our Pomodoro focus timer, academic planner, and expert study tips for effective exam preparation and concentration.',
  });
});



app.get('/timer', (req, res) => {
  res.render('timer', { 
    pageTitle: 'Best Pomodoro Focus Timer for Students | Study Better',
    metaDescription: 'Master focus techniques with our aesthetic Pomodoro timer. Customizable study intervals and distraction blocking to enhance your deep work sessions.'
  });
});

app.get('/tasks', (req, res) => {
  res.render('tasks', { 
    pageTitle: 'Academic Planner & Student Task Manager | Stay Productive',
    metaDescription: 'Organize your study routine with our free academic planner. Track assignments and exam preparation goals to maintain high student productivity.'
  });
});

app.get('/flashcards', (req, res) => {
  res.render('flashcards', { 
    pageTitle: 'AI Flashcard Maker - Convert PDF to Study Cards Instantly',
    metaDescription: 'Accelerate your exam preparation with our AI-powered flashcard maker. Transform lecture notes into interactive study tools using advanced extraction.'
  });
});

app.get('/notes', (req, res) => {
  res.render('notes', { 
    pageTitle: 'Free Study Notes & Academic PDF Guides for Students',
    metaDescription: 'Download free student notes and exam preparation guides. Access high-quality academic materials to improve your study routine.'
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
  res.render('privacy-policy', { 
    pageTitle: 'Privacy Policy | 2AM Study Data Protection',
    metaDescription: 'Read our privacy policy to understand how we protect your student productivity data and maintain your privacy on our platform.'
  });
});
app.get('/terms', (req, res) => {
  res.render('terms', { 
    pageTitle: 'Terms & Conditions | Student Usage Guidelines',
    metaDescription: 'Understand the terms of service for using 2AM Study productivity tools, focus techniques, and community resources.'
  });
});
app.get('/about', (req, res) => {
  res.render('about', { 
    pageTitle: 'About 2AM Study - Empowering Students with Focus Techniques',
    metaDescription: 'Learn about our mission to improve student productivity through smart work, effective study tips, and free academic tools.'
  });
});
app.get('/contact', (req, res) => {
  res.render('contact', { 
    pageTitle: 'Contact Us | Support for Student Productivity Tools',
    metaDescription: 'Need help with our study tools or focus techniques? Contact the 2AM Study support team for academic guidance and assistance.'
  });
});
app.get('/behind-2am-study', (req, res) => {
  res.render('behind-2am-study', { 
    pageTitle: 'Behind 2 AM Study - Our Story, Mission & Vision',
    metaDescription: 'Discover the story behind 2AM Study. Learn about our mission to empower students with the best focus tools and study techniques for late-night success.',
    ogTitle: 'Behind 2 AM Study: The Story of a Student Productivity Revolution',
    ogDescription: 'From late-night study sessions to a global platform. Learn how we built the ultimate hub for students to master focus and achieve academic excellence.',
    ogImage: 'https://2amstudy.com/assets/images/smart_study_banner.png',
    ogUrl: 'https://2amstudy.com/behind-2am-study'
  });
});

app.get('/store', (req, res) => {
  res.render('store', {
      pageTitle: '2AM Study Store - Student Essentials, Digital Tools & Accessories',
      metaDescription: 'Shop curated study accessories, digital planners, focus tools and wellness products designed for students. Free digital downloads & fast WhatsApp ordering.',
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
      hideBot: true
    });
});

app.get('/store/product/:id', (req, res) => {
  const productId = Number(req.params.id);
  const product = STORE_PRODUCTS.find(p => p.id === productId) || null;
  if (!product) {
    return res.status(404).render('store-payment-success', {
      pageTitle: 'Product Not Found | 2AM Study Store',
      metaDescription: 'Requested product is not available.',
      paymentId: '',
      orderId: '',
      hideBot: true
    });
  }
  return res.render('store-product', {
    pageTitle: `${product.name} | 2AM Study Store`,
    metaDescription: product.desc,
    product,
    storeProducts: STORE_PRODUCTS,
    hideBot: true
  });
});

app.get('/store/order-summary', (req, res) => {
  res.render('store-order-summary', {
    pageTitle: 'Order Summary | 2AM Study Store',
    metaDescription: 'Review your cart items, total amount, and proceed to checkout securely.',
    hideBot: true
  });
});

app.get('/store/payment', (req, res) => {
  res.render('store-payment', {
    pageTitle: 'Complete Payment | 2AM Study Store',
    metaDescription: 'Complete secure Razorpay payment for your 2AM Study Store order.',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    hideBot: true
  });
});

app.get('/store/payment-success', (req, res) => {
  res.render('store-payment-success', {
    pageTitle: 'Payment Successful | 2AM Study Store',
    metaDescription: 'Your payment is successful. Thank you for shopping with 2AM Study Store.',
    paymentId: req.query.payment_id || '',
    orderId: req.query.order_id || '',
    hideBot: true
  });
});


// --- Blog Section ---
app.get('/blog', (req, res) => {
  res.render('blog/index', { 
    pageTitle: '2AM Study Blog - Best Study Tips & Student Productivity Guides',
    metaDescription: 'Expert study tips for exam preparation, focus techniques for concentration, and productivity hacks to help students excel academically.'
  });
});
app.get('/blog/how-to-stay-focused', (req, res) => {
  res.render('blog/how-to-stay-focused', { 
    pageTitle: 'How to Stay Focused While Studying | Concentration Techniques',
    metaDescription: 'Struggling with distractions? Learn expert concentration techniques and study tips to maintain deep focus for longer periods.'
  });
});
app.get('/blog/best-study-techniques', (req, res) => {
  res.render('blog/best-study-techniques', { 
    pageTitle: '7 Best Study Techniques for Students | Exam Preparation',
    metaDescription: 'Master your exams with science-backed study techniques like Pomodoro, Active Recall, and Spaced Repetition for better student success.'
  });
});
app.get('/blog/avoid-distraction', (req, res) => {
  res.render('blog/avoid-distraction', { 
    pageTitle: 'How to Avoid Distractions While Studying | Student Productivity',
    metaDescription: 'Transform your study environment and block digital distractions. Practical focus techniques to help students stay productive.'
  });
});
app.get('/blog/daily-study-routine', (req, res) => {
  res.render('blog/daily-study-routine', { 
    pageTitle: 'Perfect Daily Study Routine for Academic Success',
    metaDescription: 'Build a consistent study schedule with our daily routine guide. Tips for balancing lectures, rest, and deep work sessions.'
  });
});
app.get('/blog/build-consistency', (req, res) => {
  res.render('blog/build-consistency', { 
    pageTitle: 'How to Build Consistency in Your Study Habits',
    metaDescription: 'Motivation is the start, but consistency is the key. Learn how to maintain a long-term study routine and achieve your academic goals.'
  });
});
app.get('/blog/no-motivation-2am-study', (req, res) => {
  res.render('blog/no-motivation-2am-study', { 
    pageTitle: 'No Motivation? Start 2AM Study With Me',
    metaDescription: 'Learn how to overcome a lack of study motivation with our actionable 2AM strategy and focus tools.'
  });
});

app.get('/blog/mistakes-before-exams', (req, res) => {
  res.render('blog/mistakes-before-exams', { 
    pageTitle: '20 Common Mistakes Students Make 7 Days Before Exams | 2AM Study',
    metaDescription: 'Avoid these 20 common exam mistakes and last-minute preparation errors. Get the best study tips for 7 days before exams to improve your academic performance with 2AM Study.'
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

app.get('/blog/smart-work-student-success', (req, res) => {
  res.render('blog/smart-work-student-success', {
    pageTitle: 'How 2 AM Study Transforms Hard Work into Smart Work for Student Success',
    metaDescription: 'Learn how to maximize output and minimize burnout by shifting from mere hard work to effective smart work with 2AM Study.',
  });
});

// --- Study Tools ---
app.get('/study-tools', (req, res) => {
  res.render('tools/index', { 
    pageTitle: 'Student Productivity Tools Hub | Complete Academic Toolkit',
    metaDescription: 'Discover a comprehensive suite of student productivity tools. From syllabus trackers to timetable generators, we provide everything you need to succeed.'
  });
});

app.get('/exam-countdown', (req, res) => {
  res.render('tools/exam-countdown', { 
    pageTitle: 'Online Exam Countdown Timer | Track Your Study Deadlines',
    metaDescription: 'Never miss an exam date again. Set multiple countdown timers for your finals and stay on top of your academic preparation.'
  });
});
app.get('/syllabus-tracker', (req, res) => {
  res.render('tools/syllabus-tracker', { 
    pageTitle: 'Free Syllabus Tracker Online | Track Subject Progress',
    metaDescription: 'Visualize your course completion with our interactive syllabus tracker. Stay motivated by checking off chapters as you study.'
  });
});
app.get('/timetable-generator', (req, res) => {
  res.render('tools/timetable-generator', { 
    pageTitle: 'Student Study Timetable Generator | PDF Export',
    metaDescription: 'Create a professional and personalized study schedule in seconds. Optimize your study routine and export your timetable as a PDF.'
  });
});

// --- Calculators ---
app.get('/calculators', (req, res) => {
  res.render('calculators/index', { 
    pageTitle: 'Student Calculator Hub: GPA, Age & Percentage Tools',
    metaDescription: 'Access free online calculators for students. Calculate GPA/CGPA, score percentages, and precise age with our easy-to-use tools.'
  });
});
app.get('/calculators/cgpa', (req, res) => {
  res.render('calculators/cgpa', { 
    pageTitle: 'Online CGPA Calculator for Students | Academic Success',
    metaDescription: 'Calculate your semester and cumulative GPA easily. Enter your grades and credits to track your academic performance.'
  });
});
app.get('/calculators/percentage', (req, res) => {
  res.render('calculators/percentage', { 
    pageTitle: 'Free Percentage Calculator Online | Score & Grade Tool',
    metaDescription: 'Calculate marks percentage, academic scores, and fractional increases instantly with our free student tool.'
  });
});
app.get('/calculators/age', (req, res) => {
  res.render('calculators/age', { 
    pageTitle: 'Online Age Calculator | Precise Years, Months & Days',
    metaDescription: 'Find your exact age in seconds. Perfect for filling out student applications and administrative forms.'
  });
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

app.post('/api/store/create-order', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay is not configured on server.' });
    }

    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount.' });
    }

    const metadata = req.body.metadata || {};
    const customer = metadata.customer || {};
    const safe = (val, max = 120) => String(val || '').trim().slice(0, max);
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `2am_${Date.now()}`,
      notes: {
        source: 'student_store',
        coupon: safe(metadata.coupon || 'none', 40),
        itemCount: safe(metadata.itemCount || 0, 10),
        customerName: safe(customer.name, 80),
        customerPhone: safe(customer.phone, 20),
        customerEmail: safe(customer.email, 80),
        customerCity: safe(customer.city, 60),
        customerPincode: safe(customer.pincode, 20),
        customerAddress: safe(customer.address, 200)
      }
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return res.status(500).json({ error: 'Unable to create payment order.' });
  }
});

app.post('/api/store/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing payment verification fields.' });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');
    const verified = generatedSignature === razorpay_signature;

    if (!verified) {
      return res.status(400).json({ verified: false, error: 'Payment verification failed.' });
    }
    return res.json({ verified: true });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return res.status(500).json({ verified: false, error: 'Verification service unavailable.' });
  }
});

// Help Bot Doubt Solver (AI Proxy)
const doubtHandler = require('../api/doubt');
app.post('/api/doubt', doubtHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
