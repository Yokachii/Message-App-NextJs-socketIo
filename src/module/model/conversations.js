const { Sequelize, DataTypes, UUID, UUIDV4, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';

const Conversation = sequelize.define('conversation', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    creator: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    title:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    updated_at:{
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'conversation',
    name: 'conversation',
    modelNamel: 'conversation'
});

(async () => {
    await Conversation.sync({force:true});

    console.log('La table "conversation" a été charger');
})();

export default Conversation