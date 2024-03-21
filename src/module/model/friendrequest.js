const { Sequelize, DataTypes, } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';

const FriendRequest = sequelize.define('friendrequest', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    sended_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    sended_to: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
}, {
    timestamps: false,
    tableName: 'friendrequest',
    name: 'friendrequest',
    modelName: 'friendrequest'
});

(async () => {
    await FriendRequest.sync({});

    console.log('La table "friendrequest" a été charger');
})();

export default FriendRequest