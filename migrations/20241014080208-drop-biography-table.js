'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the "Biography" table
    await queryInterface.dropTable('Biographies');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the "Biography" table if needed
    await queryInterface.createTable('Biographies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bioText: {
        type: Sequelize.TEXT
      },
      profileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};