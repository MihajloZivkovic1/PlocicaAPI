'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    static associate(models) {
      // Each story belongs to one profile
      Story.belongsTo(models.Profile, {
        as: "Stories",
        foreignKey: 'profileId',
        onDelete: 'CASCADE'
      });
    }
  }

  Story.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Profiles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Story',
  });

  return Story;
};