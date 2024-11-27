'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {

    }
  }

  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    activationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'inactive',
    },
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};