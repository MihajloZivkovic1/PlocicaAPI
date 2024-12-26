'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * 
     */
    static associate(models) {
      Profile.hasMany(models.Story, {
        as: "Stories",
        foreignKey: 'profileId', onDelete: 'CASCADE'
      });

      Profile.hasMany(models.Event, {
        as: "Events",
        foreignKey: "profileId", onDelete: "CASCADE"
      });

      Profile.hasMany(models.Media, {
        as: "Media",
        foreignKey: "profileId", onDelete: "CASCADE"
      });

      Profile.hasMany(models.Group, {
        as: "Groups",
        foreignKey: "profileId", onDelete: "CASCADE"
      })
    }
  }

  Profile.init({
    profileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOfDeath: {
      type: DataTypes.DATE,
      allowNull: true
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    placeOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfDeath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });

  return Profile;
};