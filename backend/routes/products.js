const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products — supports ?search= and ?category=
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Products fetch error:', err.message);
    res.status(500).json({ message: 'Failed to load products.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Product fetch error:', err.message);
    res.status(500).json({ message: 'Failed to load product.' });
  }
});

// POST /api/products — unauthenticated (seeding / testing convenience only)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
});

module.exports = router;
