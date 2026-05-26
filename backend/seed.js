const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Over-ear Bluetooth headphones with 30-hour battery life and active noise cancellation.',
    price: 89.99,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Compact TKL mechanical keyboard with RGB backlighting and tactile switches.',
    price: 59.99,
    category: 'Electronics',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'USB-C Hub 7-in-1',
    description: 'Multi-port hub with HDMI, USB-A, SD card reader, and 100W PD charging.',
    price: 34.99,
    category: 'Electronics',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1625948515954-df0f5cf77e81?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'Classic Fit Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    price: 14.99,
    category: 'Clothing',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'Slim Fit Chino Pants',
    description: 'Modern slim-fit chinos made from stretch cotton blend. Machine washable.',
    price: 39.99,
    category: 'Clothing',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'Lightweight Running Jacket',
    description: 'Water-resistant windbreaker jacket ideal for running and outdoor activities.',
    price: 54.99,
    category: 'Clothing',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'Clean Code by Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. Essential reading for developers.',
    price: 29.99,
    category: 'Books',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=280&fit=crop&auto=format',
  },
  {
    name: 'The Pragmatic Programmer',
    description: 'Your journey to mastery — timeless advice for software developers.',
    price: 24.99,
    category: 'Books',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=280&fit=crop&auto=format',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
