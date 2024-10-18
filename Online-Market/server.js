const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://angelkira65:dEXs0UbBMQJ8B468@comp229.zh4sv.mongodb.net/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
}).then(() => { 
  console.log('Connected to MongoDB');
}).catch((err) => { 
  console.error('Error connecting to MongoDB:', err);
});

// Modelo de producto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

// Controlador de producto
const productController = {
  createProduct: async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send();
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).send();
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).send();
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

// Rutas de producto
const router = express.Router();
router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
app.use('/api', router);

// Ruta principal
app.get('/', (req, res) => {
  res.send('Welcome to the Marketplace API, This is Angelica from COMP229 :)');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
