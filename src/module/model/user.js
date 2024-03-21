const { Sequelize, DataTypes } = require('sequelize');
import sequelize from '../sequelize'

const User = sequelize.define('users_message', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    username:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    firstname:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    lastname:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    email:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    password:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
    },
    created_at:{
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'users_message',
    name: 'users_message',
    modelName: 'users_message'
});

(async () => {
    await User.sync({});

    console.log('La table "users_message" a été charger');
})();

export default User;