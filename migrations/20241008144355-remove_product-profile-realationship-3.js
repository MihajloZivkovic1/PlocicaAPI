'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'profileId');
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally, you can add the column back if you want to revert this migration
    await queryInterface.addColumn('Products', 'profileId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Profiles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
};