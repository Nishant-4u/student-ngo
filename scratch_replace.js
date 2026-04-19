const fs = require('fs');

const files = [
  'src/views/store-cart.ejs',
  'src/views/store-order-summary.ejs',
  'src/views/store-payment.ejs',
  'src/views/store-payment-success.ejs',
  'src/views/store-product.ejs',
  'src/views/partials/footer.ejs'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace the exact template literal string with just the <%= %> block
    // From: `<%= process.env.NEXT_PUBLIC_API_URL || '' %>/api/store/cart`
    // To:   `<%= process.env.NEXT_PUBLIC_API_URL %>/api/store/cart`
    content = content.replace(/<%= process\.env\.NEXT_PUBLIC_API_URL \|\| '' %>/g, '<%= process.env.NEXT_PUBLIC_API_URL %>');
    
    fs.writeFileSync(file, content);
  }
});
console.log('Done');
