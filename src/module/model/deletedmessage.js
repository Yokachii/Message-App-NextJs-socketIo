const { Sequelize, DataTypes } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import Messages from './messages'

const DeletedMessage = sequelize.define('deletedmessage', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    message_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Messages,
            key: 'id'
        }
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    
    deleted_at:{
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'deletedmessage',
    name: 'deletedmessage',
    modelName: 'deletedmessage'
});

(async () => {
    await DeletedMessage.sync({});

    console.log('La table "deletedMessage" a été charger');
})();

export default DeletedMessage
