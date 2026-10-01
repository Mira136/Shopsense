const router = require('express').Router();
const { auth, optionalAuth } = require('../middleware/auth');
const A = require('../controllers/authController');
const P = require('../controllers/productController');
const W = require('../controllers/wishlistController');
const G = require('../controllers/priceGuardController');
const O = require('../controllers/orderController');

router.post('/auth/register', A.register);
router.post('/auth/login', A.login);
router.get('/auth/me', auth, A.me);

router.get('/products', P.list);
router.get('/products/search', P.search);
router.get('/products/category/:category', P.byCategory);
router.get('/products/:id', P.get);
router.patch('/products/:id/price', P.updatePrice);
router.get('/products/:id/recommendation', optionalAuth, P.recommendation);

router.get('/wishlist', auth, W.list);
router.post('/wishlist/:productId', auth, W.add);
router.delete('/wishlist/:productId', auth, W.remove);

router.get('/price-guard', auth, G.list);
router.post('/price-guard/:productId', auth, G.add);
router.delete('/price-guard/:productId', auth, G.remove);

router.post('/orders', auth, O.create);
router.get('/orders', auth, O.list);
router.get('/orders/:id', auth, O.get);
module.exports = router;
