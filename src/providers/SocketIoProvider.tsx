import { getServerSession } from "next-auth";
import { createContext, useContext } from "react";
import { Server } from 'Socket.IO'
import {Conversations,DeletedMessage,FriendRequest,Friendship,Messages,MessagesDm,Participants,User} from '@/module/association'

const SocketContext = createContext({});

export default function SocketContextt({children}:any) {
  
  const serveur = require('http').createServer()

  const io = new Server(serveur)
  io.on('connection', () => {
    console.log('CONNECTEDD EHEH')
  });
  serveur.listen(3001);


  return (
    <SocketContext.Provider value={{ io }}>
      {children}
    </SocketContext.Provider>
  );
}

// export const useUser = () => useContext(SocketContext);

// const SocketHandler = async (req, res) => {
//   if (res.socket.server.io) {
//     console.log('Socket is already running')
//   } else {
//     console.log('Socket is initializing')
//     const io = new Server(res.socket.server)
//     let Users = []
//     res.socket.server.io = io

//     io.on('connection', async (socket) => {

//       socket.emit('set-socket', socket.id)
//       socket.on('set-info',data => {
//         console.log(`room "User-room-${data.user.id}" joined by ${socket.id}`)
//         socket.join(`User-room-${data.user.id}`)
//       })

//       socket.on('get-conversation', async data => {
//         // console.log('|||||||||||||||||||||||||||||||||||||||||||||| fetched')
//         const user = await User.findByPk(data.id, {
//           // include: {
//           //   model: Conversations,
//           //   as: 'UserConversations', // This should match the alias used in the association definition
//           //   through: { attributes: [] } // If using a many-to-many association, this ensures only the conversations are loaded without any intermediate data
//           // }
//           include: [
//             {
//               model: Conversations,
//               as: 'UserConversations', // This should match the alias used in the association definition
//               through: { attributes: [] } // If using a many-to-many association, this ensures only the conversations are loaded without any intermediate data
//             },
//             {
//               model: User,
//               as: 'FriendRequestSender', // Include sender user
//               attributes: ['id', 'firstname', 'lastname', 'email', 'username'] // Select specific attributes to include
//             },
//             {
//               model: User,
//               as: 'FriendRequestReceiver', // Include receiver user
//               attributes: ['id', 'firstname', 'lastname', 'email', 'username'] // Select specific attributes to include
//             }
//           ]
//       })

//         if(!user) return

//         const Coversation = user.dataValues.UserConversations;
//         const Received = user.dataValues.FriendRequestReceiver;
//         socket.emit('set-conversation',{conv:Coversation,friendReceived:Received})

//       })

//       socket.on('message-sent-to-dm', async data => {
//         const {sent_by,sent_to,content} = data
//         const user1 = await User.findByPk(sent_by)
//         let ourFriendShip = await Friendship.findOne({where:{user1Id:sent_by,user2Id:sent_to}})
//         if(!ourFriendShip){
//           ourFriendShip = await Friendship.findOne({where:{user1Id:sent_to,user2Id:sent_by}})
//         }
//         if(!ourFriendShip) return;
//         MessagesDm.create({
//           friendshipId: ourFriendShip.dataValues.id, // ID of the conversation associated with the message
//           sender_id: sent_by, // ID of the user who sent the message
//           message: content, // Content of the message
//           created_at: Date.now().toString()|"19h34 (jsp)" // Current timestamp or any other appropriate value
//         }).then(x=>{
//           const messageItem = {
//             name:user1.dataValues.username,
//             pdp:`https://maville.com/photosmvi/2016/09/27/P1D3055327G.jpg`,
//             text:data.content,
//             date:Date.now().toString()|"19h34 (jsp)",
//             id:x.id,
//           }
//           io.to(`User-room-${sent_to}`).emit(`new-message`,{...data,...{message:messageItem,date:new Date(),username:user1.dataValues.username}})
//           socket.emit(`sended-succes`,messageItem)
//         })
        
//       })

//       socket.on('sent-friend', async data => {
//         io.to(`User-room-${data.userId}`).emit(`friend-received`,data);
//       })

//       socket.on('disconnect', async ()=>{
//         console.log(`client ${socket.id} disconnected.....`)
//       })



//     })
//   }
//   res.end()
// }

// export default SocketHandler

























