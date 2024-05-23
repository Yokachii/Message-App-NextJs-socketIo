const { Sequelize, DataTypes } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import Friendship from './friendship'

const MessagesDm = sequelize.define('dm_messages', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    friendshipId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Friendship,
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
    status:{
        type: DataTypes.TEXT,
        allowNull:false
    }
}, {
    timestamps: false,
    tableName: 'dm_messages',
    name: 'dm_messages',
    modelName: 'dm_messages'
});

(async () => {
    await MessagesDm.sync({});

    console.log('La table "dm_messages" a été charger');
})();

export default MessagesDm