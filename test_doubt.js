const http = require('http');

const data = JSON.stringify({
  prompt: 'Who are you?'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/doubt',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let str = '';
  res.on('data', chunk => str += chunk);
  res.on('end', () => console.log('Response:', str));
});

req.write(data);
req.end();
