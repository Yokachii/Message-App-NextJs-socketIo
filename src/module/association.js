import User from './model/user';
import Friendship from './model/friendship';
import Participants from './model/participants';
import Messages from './model/messages';
import DeletedMessage from './model/deletedmessage';
import Conversations from './model/conversations';

// Define associations
User.hasMany(Friendship, { foreignKey: 'user1Id' });
User.hasMany(Friendship, { foreignKey: 'user2Id' });

User.hasMany(Messages, { foreignKey: 'sender_id' });

Conversations.belongsTo(User, { foreignKey: 'creator' });

Conversations.hasMany(Messages, { foreignKey: 'conversation_id' });
Conversations.hasMany(Participants, { foreignKey: 'conversation_id' });

User.belongsToMany(Conversations, { through: Participants, foreignKey: 'user_id' });
Conversations.belongsToMany(User, { through: Participants, foreignKey: 'conversation_id' });

// Export models
export { User, Friendship, Participants, Messages, DeletedMessage, Conversations };
