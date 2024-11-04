const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();


router.post('/', authMiddleware, authorize(['procurement_manager']), createOrder);
router.get('/', authMiddleware, getOrders);
router.patch('/status', authMiddleware, authorize(['admin', 'inspection_manager', 'procurement_manager']), updateOrderStatus);

module.exports = router;

