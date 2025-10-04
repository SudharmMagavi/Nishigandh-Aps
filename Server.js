// 1. Import Dependencies
require('dotenv').config(); // Loads environment variables from a .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve your static front-end files

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// 4. Define Mongoose Schema and Model for Products
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    original_price: Number,
    image_url: String,
    category: String
});
const Product = mongoose.model('Product', productSchema);

// 5. Create API Routes
// This route gets ALL products from the database
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// --- THIS NEW ROUTE GETS A SINGLE PRODUCT BY ITS ID ---
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details" });
    }
});


// Function to add sample products to the database
async function addSampleProducts() {
    try {
        const productCount = await Product.countDocuments();
        if (productCount > 0) {
            console.log("Database already contains products. Skipping sample data injection.");
            return;
        }
        
        console.log("Adding sample products...");
        await Product.create([
            { name: 'Women Floral Print Kurta', description: 'A beautifully crafted straight kurta with an elegant floral print. Perfect for casual outings and semi-formal events. Made with soft, breathable cotton.', price: 699.00, original_price: 1299.00, image_url: 'Images/women kurta' },
            { name: 'Ragini Halter Neck Kurti', description: 'A stylish halter neck kurti made from premium fabric. Ideal for a chic and modern look.', price: 899.00, original_price: 1699.00, image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop' },
            { name: 'Straight Denim Jeans', description: 'Classic and comfortable straight-fit denim jeans for everyday wear. A versatile wardrobe essential.', price: 899.00, original_price: 1499.00, image_url: 'Images/jeans' },
            { name: 'Embroided Semi-Stitched Kurta', description: 'An elegant embroided and semi-stitched kurta, perfect for special occasions and festive events.', price: 799.00, original_price: 999.00, image_url: 'Images/ghagra' }
        ]);
        console.log("Sample products added!");
    } catch (error) {
        console.error("Error adding sample products:", error);
    }
}


// 6. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    addSampleProducts(); // Add sample data when the server starts (if the DB is empty)
});