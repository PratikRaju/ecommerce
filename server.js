const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable core server settings
app.use(cors({ origin: "*" }));
app.use(express.json());

// Tell Node.js to serve storefront files out of the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// CONNECT TO MONGODB DATABASE
// ==========================================
const MONGO_URI = 'mongodb://127.0.0.1:27017/aurora_restaurant';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB database.'))
    .catch(err => console.error('Database connection error:', err));

// ==========================================
// DATA SCHEMAS
// ==========================================

// Existing Table Reservation Schema
const ReservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Reservation = mongoose.model('Reservation', ReservationSchema);

// Prawn Pickle Product Order Schema
const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    productName: { type: String, default: "Premium House Prawn Pickle" },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending Delivery" },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// ==========================================
// DATA API ENDPOINTS (ROUTES)
// ==========================================

// [POST] Endpoint: Handles storefront table reservations
app.post('/api/reservations', async (req, res) => {
    try {
        const { name, email, date, time, guests } = req.body;
        
        // Explicitly format data map to clear strict schema checking crashes
        const newReservation = new Reservation({ name, email, date, time, guests });
        
        await newReservation.save();
        res.status(201).json({ success: true, message: 'Reservation saved!' });
    } catch (error) {
        console.error("Backend Reservation Save Error Details:", error);
        res.status(500).json({ success: false, message: 'Error processing database query.' });
    }
});

// [GET] Endpoint: Fetches all stored reservations for the dashboard
app.get('/api/admin/reservations', async (req, res) => {
    try {
        const allBookings = await Reservation.find().sort({ createdAt: -1 });
        res.json(allBookings);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// [POST] Endpoint: Receives prawn pickle checkout form submissions
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, phoneNumber, deliveryAddress, quantity } = req.body;
        const PRICE_PER_JAR = 290; 
        const totalAmount = quantity * PRICE_PER_JAR;

        const newOrder = new Order({
            customerName,
            phoneNumber,
            deliveryAddress,
            quantity,
            totalPrice: totalAmount
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully!" });
    } catch (error) {
        console.error("Backend Order Save Error Details:", error);
        res.status(500).json({ success: false, message: "Error processing order parameters." });
    }
});

// [GET] Endpoint: Fetches pickle delivery orders for the admin panel
app.get('/api/admin/orders', async (req, res) => {
    try {
        const allOrders = await Order.find().sort({ createdAt: -1 });
        res.json(allOrders);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ==========================================
// PAGE ROUTING RULES
// ==========================================
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Backend server successfully running on http://127.0.0.1:${PORT}`);
});
