const { Sequelize, DataTypes } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import DmMessage from './dmmessage'

const DeletedMessageDm = sequelize.define('deletedmessagedm', {
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
            model: DmMessage,
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
    message: {
        type:DataTypes.TEXT,
        allowNull:false,
    },
    deleted_at:{
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'deletedmessagedm',
    name: 'deletedmessagedm',
    modelName: 'deletedmessagedm'
});

(async () => {
    await DeletedMessageDm.sync({});

    console.log('La table "deletedmessagedm" a été charger');
})();

export default DeletedMessageDm
