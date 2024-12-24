'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // A Group belongs to a Profile
      Group.belongsTo(models.Profile, {
        as: 'Profile',
        foreignKey: 'profileId',
        onDelete: 'CASCADE',
      });

      // A Group has many Links
      Group.hasMany(models.Link, {
        as: 'Links',
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
      });
    }
  }

  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Profiles',
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
    modelName: 'Group',
  });

  return Group;
};
