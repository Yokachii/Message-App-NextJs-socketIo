const { Sequelize, DataTypes, } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';

const Friendship = sequelize.define('friendships', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    user1Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    user2Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
}, {
    timestamps: false,
    tableName: 'friendships',
    name: 'friendships',
    modelName: 'friendships'
});

(async () => {
    await Friendship.sync({});

    console.log('La table "friendship" a été charger');
})();

export default Friendship