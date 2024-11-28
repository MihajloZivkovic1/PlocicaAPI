'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Events', 'timeOfEvent', {
      type: Sequelize.TIME, // Ensures it's TIME without time zone
      allowNull: true, // Allows null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Events', 'timeOfEvent', {
      type: Sequelize.STRING, // Reverts to the previous type if necessary
      allowNull: true,
    });
  }
};
