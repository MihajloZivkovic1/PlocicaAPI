'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Each story belongs to one profile
      Event.belongsTo(models.Profile, {
        as: "Events",
        foreignKey: 'profileId',
        onDelete: 'CASCADE'
      });
    }
  }

  Event.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfEvent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    timeOfEvent: {
      type: DataTypes.TIME,
      allowNull: true
    },
    linkOfEvent: {
      type: DataTypes.STRING,
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
    sequelize,
    modelName: 'Event',
  });

  return Event;
};