const { Sequelize, DataTypes, UUID, UUIDV4, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import Conversation from './conversasion'

const Participants = sequelize.define('participants', {
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
    user_id:{
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'participants',
    name: 'participants',
    modelNamel: 'participants'
});

(async () => {
    await Participants.sync({});

    console.log('La table "room" a été charger');
})();

export default Participants