const { Sequelize, DataTypes, UUID, UUIDV4, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import Conversation from './conversasion'

const Messages = sequelize.define('messages', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    conversation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Conversation,
            key: 'id'
        }
    },
    sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    message:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at:{
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'messages',
    name: 'messages',
    modelNamel: 'messages'
});

(async () => {
    await Messages.sync({});

    console.log('La table "messages" a été charger');
})();

export default Messages