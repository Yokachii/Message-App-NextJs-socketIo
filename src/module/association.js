import User from './model/user';
import Friendship from './model/friendship';
import Participants from './model/participants';
import Messages from './model/messages';
import DeletedMessage from './model/deletedmessage';
import Conversations from './model/conversations';
import FriendRequest from './model/friendrequest'
import MessagesDm from './model/dmmessage'
import DeletedMessagesDm from './model/deletedmessagedm'

// Define associations
User.belongsToMany(User, {
    through: Friendship,
    as: 'UserFriendships1',
    foreignKey: 'user1Id'
});
User.belongsToMany(User, {
    through: Friendship,
    as: 'UserFriendships2',
    foreignKey: 'user2Id'
});

// Conversations.hasMany(Messages, { foreignKey: 'conversation_id', as: 'FriendshipMessages' });

User.hasMany(Messages, { foreignKey: 'sender_id', as: 'UserMessages' });
User.hasMany(MessagesDm, { foreignKey: 'sender_id', as: 'UserMessagesDm' });
Friendship.hasMany(MessagesDm, { foreignKey: 'friendshipId', as: 'FriendShipMessages' });

Conversations.belongsTo(User, { foreignKey: 'creator', as: 'ConversationCreator' });

Conversations.hasMany(Messages, { foreignKey: 'conversation_id', as: 'ConversationMessages' });
Conversations.hasMany(Participants, { foreignKey: 'conversation_id', as: 'ConversationParticipants' });

User.belongsToMany(Conversations, { through: Participants, foreignKey: 'user_id', as: 'UserConversations' });
Conversations.belongsToMany(User, { through: Participants, foreignKey: 'conversation_id', as: 'ConversationUsers' });

// User.hasMany(FriendRequest, { foreignKey: 'sended_by', as: 'UserSendedFriend' });
// User.hasMany(FriendRequest, { foreignKey: 'sended_to', as: 'UserReceivedFriend' });
User.belongsToMany(User, {
    through: FriendRequest,
    as: 'FriendRequestSender',
    foreignKey: 'sended_by'
});
  
User.belongsToMany(User, {
    through: FriendRequest,
    as: 'FriendRequestReceiver',
    foreignKey: 'sended_to'
});


// Export models
export { MessagesDm,FriendRequest, User, Friendship, Participants, Messages, DeletedMessagesDm, DeletedMessage, Conversations };