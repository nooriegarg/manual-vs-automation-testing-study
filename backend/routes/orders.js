const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

// POST /api/orders — place a new order (auth required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    const order = await Order.create({
      userId: req.user.userId,
      items,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Order error:', err.message);
    res.status(500).json({ message: 'Failed to place order. Please try again.' });
  }
});

// GET /api/orders — get logged-in user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Orders fetch error:', err.message);
    res.status(500).json({ message: 'Failed to load orders.' });
  }
});

module.exports = router;
