import { Server } from 'Socket.IO'
import { parse } from '@mliebelt/pgn-parser'
import {Conversations,DeletedMessage,FriendRequest,Friendship,Messages,MessagesDm,Participants,User} from '@/module/association'
import Conversation from '@/module/model/conversations'
import sequelize from '@/module/sequelize'

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    let Users = []
    res.socket.server.io = io

    io.on('connection', async (socket) => {

      socket.emit('set-socket', socket.id)

      
      socket.on('set-info',data => {
        console.log(`room "User-room-${data.user.id}" joined by ${socket.id}`)
        if(data.conv){
          console.log(`room "Conversation-room-${data.conv}" joined by ${socket.id}`)
          socket.join(`Conversation-room-${data.conv}`)
        }
        socket.userId = data.user.id
        // console.log('joined : '+`User-room-${data.user.id}`)
        socket.join(`User-room-${data.user.id}`)
      })
      
      socket.on('get-conversation', async data => {
        // console.log('|||||||||||||||||||||||||||||||||||||||||||||| fetched')
        const user = await User.findByPk(data.id, {
          // include: {
            //   model: Conversations,
            //   as: 'UserConversations', // This should match the alias used in the association definition
            //   through: { attributes: [] } // If using a many-to-many association, this ensures only the conversations are loaded without any intermediate data
            // }
            include: [
              {
                model: Conversations,
                as: 'UserConversations', // This should match the alias used in the association definition
                through: { attributes: [] } // If using a many-to-many association, this ensures only the conversations are loaded without any intermediate data
              },
              {
                model: User,
                as: 'FriendRequestSender', // Include sender user
                attributes: ['id', 'firstname', 'lastname', 'email', 'username'] // Select specific attributes to include
              },
              {
                model: User,
                as: 'FriendRequestReceiver', // Include receiver user
                attributes: ['id', 'firstname', 'lastname', 'email', 'username'] // Select specific attributes to include
              }
            ]
      })

      const conversations = await Conversations.findAll({
        include: [
          {
            model: User,
            as: 'ConversationUsers',
            through: { attributes: [] }, // This removes the join table from the results
            where: { id: data.id },
            attributes: ['id', 'firstname', 'lastname', 'email'] // Specify the attributes you want to include
          }
        ]
      });
      
      if(!user) return
      
      const Coversation = conversations?conversations:[];
      const Received = user.dataValues.FriendRequestReceiver;
      socket.emit('set-conversation',{conv:Coversation,friendReceived:Received})
      
    })
    
    


      socket.on('message-sent-to-dm', async data => {
        console.log(`User-room-${data.sent_to}`)
        const {sent_to,content,sent_by} = data
        
        const user1 = await User.findByPk(sent_by)
        let ourFriendShip = await Friendship.findOne({where:{user1Id:sent_by,user2Id:sent_to}})
        if(!ourFriendShip){
          ourFriendShip = await Friendship.findOne({where:{user1Id:sent_to,user2Id:sent_by}})
        }
        if(!ourFriendShip) return;
        let time = Date.now().toString()
        console.log(`date : ${time}`)
        MessagesDm.create({
          friendshipId: ourFriendShip.dataValues.id, // ID of the conversation associated with the message
          sender_id: sent_by, // ID of the user who sent the message
          message: content, // Content of the message
          created_at: time, // Current timestamp or any other appropriate value
          status:"sended",
        }).then(x=>{
          const messageItem = {
            sender_id:sent_by,
            pdp:`https://maville.com/photosmvi/2016/09/27/P1D3055327G.jpg`,
            message:content,
            created_at:time,
            status:"distribut",
            id:x.id,
          }
          const newData = {sent_to,sent_by,message:messageItem}
          io.to(`User-room-${data.sent_to}`).emit(`new-message`,newData)
          io.to(`User-room-${sent_by}`).emit(`sended-succes`,messageItem)
          // io.to(`User-room-${sent_to}`).emit(`new-message`,{...data,...{message:messageItem,date:new Date(),username:user1.dataValues.username}})
        })
        
      })

      socket.on('message-sent-to-group', async data => {
        const {sent_group,sent_by,content,} = data
        console.log(`Conversation-room-${sent_group}`)
        
        const conv = Conversation.findByPk(sent_group)
        if(!conv) return console.log(bizzardddddd);
        let time = Date.now().toString()
        Messages.create({
          conversation_id: sent_group, // ID of the conversation associated with the message
          sender_id: sent_by, // ID of the user who sent the message
          message: content, // Content of the message
          created_at: time, // Current timestamp or any other appropriate value
          updated_at: time,
          status:"sended",
        }).then(x=>{
          const messageItem = {
            sender_id:sent_by,
            pdp:`https://maville.com/photosmvi/2016/09/27/P1D3055327G.jpg`,
            message:content,
            created_at:time,
            updated_at:time,
            status:"distribut",
            id:x.id,
          }
          const newData = {sent_group,sent_by,message:messageItem}
          io.to(`Conversation-room-${data.sent_group}`).emit(`new-message`,newData)
          io.to(`Conversation-room-${sent_by}`).emit(`sended-succes`,messageItem)
          // io.to(`User-room-${sent_to}`).emit(`new-message`,{...data,...{message:messageItem,date:new Date(),username:user1.dataValues.username}})
        })
        
      })

      socket.on('sent-friend', async data => {
        io.to(`User-room-${data.userId}`).emit(`friend-received`,data);
      })

      socket.on('disconnect', async ()=>{
        console.log(`client ${socket.id} disconnected.....`)
      })

      socket.on('create-group', async data => {
        const {userIds,groupName,groupOwner} = data

        userIds.push(groupOwner)

        let groupNameTmp = groupName

        if(groupNameTmp==null){
          let userNames = []
          for (let id of userIds){
            let tmpUser = await User.findOne({where:{id:id}})
            userNames.push(tmpUser.dataValues.username)
          }
          groupNameTmp = userNames.join(', ')
        }

        const transaction = await sequelize.transaction();

        try {
          // Create a new conversation
          const conversation = await Conversations.create(
            {
              creator:groupOwner,
              title:groupNameTmp,
              created_at:Date.now().toString(),
              updated_at:Date.now().toString(),
            },
            { transaction }
          );
      
          // Add the participants to the conversation
          const participants = userIds.map(userId => ({
            user_id: userId,
            conversation_id: conversation.id,
          }));
      
          await Participants.bulkCreate(participants, { transaction });
      
          await transaction.commit();
          return conversation;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }

      })



    })
  }
  res.end()
}

export default SocketHandler

























