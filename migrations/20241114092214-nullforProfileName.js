'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false, // Reverts the change in case of rollback
    });
  }
};