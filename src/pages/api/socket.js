import { Server } from 'Socket.IO'
import { parse } from '@mliebelt/pgn-parser'
import {Conversations,DeletedMessage,FriendRequest,Friendship,Messages,MessagesDm,Participants,User} from '@/module/association'

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
      
      if(!user) return
      
      const Coversation = user.dataValues.UserConversations;
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
        MessagesDm.create({
          friendshipId: ourFriendShip.dataValues.id, // ID of the conversation associated with the message
          sender_id: sent_by, // ID of the user who sent the message
          message: content, // Content of the message
          created_at: Date.now().toString()|"19h34 (jsp)", // Current timestamp or any other appropriate value
          status:"sended",
        }).then(x=>{
          const messageItem = {
            sender_id:sent_by,
            pdp:`https://maville.com/photosmvi/2016/09/27/P1D3055327G.jpg`,
            message:content,
            created_at:Date.now().toString()|"19h34 (jsp)",
            status:"sended",
            id:x.id,
          }
          const newData = {sent_to,sent_by,message:messageItem}
          io.to(`User-room-${data.sent_to}`).emit(`new-message`,newData)
          // io.to(`User-room-${sent_to}`).emit(`new-message`,{...data,...{message:messageItem,date:new Date(),username:user1.dataValues.username}})
          // socket.emit(`sended-succes`,messageItem)
        })
        
      })

      socket.on('trya', async (data) => {
        console.log('tryedA'+`User-room-${data.id}`)
        socket.emit('tryc')
        io.to(`User-room-${data.id}`).emit(`tryb`,"hey")
      })

      socket.on('sent-friend', async data => {
        io.to(`User-room-${data.userId}`).emit(`friend-received`,data);
      })

      socket.on('disconnect', async ()=>{
        console.log(`client ${socket.id} disconnected.....`)
      })



    })
  }
  res.end()
}

export default SocketHandler

























