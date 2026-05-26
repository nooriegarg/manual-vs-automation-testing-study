export const IMAGE_MAP = {
  'Wireless Noise-Cancelling Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=420&fit=crop&auto=format',
  'Mechanical Keyboard':                  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=420&fit=crop&auto=format',
  'USB-C Hub 7-in-1':                    'https://images.unsplash.com/photo-1625948515954-df0f5cf77e81?w=600&h=420&fit=crop&auto=format',
  'Classic Fit Cotton T-Shirt':           'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=420&fit=crop&auto=format',
  'Slim Fit Chino Pants':                 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=420&fit=crop&auto=format',
  'Lightweight Running Jacket':           'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=420&fit=crop&auto=format',
  'Clean Code by Robert C. Martin':       'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=420&fit=crop&auto=format',
  'The Pragmatic Programmer':             'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=420&fit=crop&auto=format',
};

export const THUMB_MAP = Object.fromEntries(
  Object.entries(IMAGE_MAP).map(([k, v]) => [k, v.replace('w=600&h=420', 'w=80&h=80')])
);

export const CARD_MAP = Object.fromEntries(
  Object.entries(IMAGE_MAP).map(([k, v]) => [k, v.replace('w=600&h=420', 'w=400&h=280')])
);

export const RATING_MAP = {
  'Wireless Noise-Cancelling Headphones': 4.5,
  'Mechanical Keyboard': 4.3,
  'USB-C Hub 7-in-1': 4.1,
  'Classic Fit Cotton T-Shirt': 4.6,
  'Slim Fit Chino Pants': 4.2,
  'Lightweight Running Jacket': 4.4,
  'Clean Code by Robert C. Martin': 4.9,
  'The Pragmatic Programmer': 4.8,
};
