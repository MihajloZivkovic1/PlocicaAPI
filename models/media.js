'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {

      Media.belongsTo(models.Profile, {
        as: "Media",
        foreignKey: 'profileId',
        onDelete: 'CASCADE'
      });
    }
  }

  Media.init({
    mediaType: {
      type: DataTypes.ENUM('photo', 'video'),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    timestamps: true,
    sequelize,
    modelName: 'Media',
  });

  return Media;
};