const { Product } = require('../models'); // Adjust path as needed

// Helper function to generate random codes
const generateCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Script to generate 30 QR codes and activation codes
const generateProducts = async () => {
  try {
    const products = [];
    for (let i = 0; i < 30; i++) {
      const qrCode = generateCode(8);
      const activationCode = generateCode(8);

      products.push({
        productName: `Product ${i + 1}`,
        qrCode,
        activationCode,
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Product.bulkCreate(products);
    console.log('Products created successfully.');
  } catch (error) {
    console.error('Error generating products:', error);
  }
};

generateProducts();