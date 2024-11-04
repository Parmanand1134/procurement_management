const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const { client, checklist } = req.body;

    const newOrder = new Order({
        procurementManager: req.user.id,
        inspectionManager: null, // This can be set later
        client,
        checklist,
        status: 'pending'
    });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        res.status(400).json({ error: 'Error creating order', details: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('procurementManager', 'email')
            .populate('client', 'email')
            .populate('inspectionManager', 'email')
            .populate('checklist');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: 'Error retrieving orders', details: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
        res.status(400).json({ error: 'Error updating order status', details: error.message });
    }
};
