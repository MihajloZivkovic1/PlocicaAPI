'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // A Link belongs to a Group
      Link.belongsTo(models.Group, {
        as: 'Group',
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
      });
    }
  }

  Link.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id',
      },
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Link',
  });

  return Link;
};
