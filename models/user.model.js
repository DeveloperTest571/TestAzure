module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
      id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        field: 'email',
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        field: 'name',
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        field: 'password',
        allowNull: true
      },
      role: {
        type: Sequelize.INTEGER,
        field: 'role',
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER,
        field: 'status',
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: true
      },
      last_login: {
        type: Sequelize.DATE,
        field: 'last_login',
        allowNull: true
      }
    }, {
      createdAt: false,
      updatedAt: false,
      paranoid: true
    })
  
    return User
  }
  