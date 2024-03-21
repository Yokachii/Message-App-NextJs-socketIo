import { Server } from 'Socket.IO'
import { parse } from '@mliebelt/pgn-parser'
import {Conversations,DeletedMessage,FriendRequest,Friendship,Messages,Participants,User} from '@/module/association'

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    let Users = []
    res.socket.server.io = io

    io.on('connection', async (socket) => {
      let roomIdLet


      socket.emit('set-socket', socket.id)
      socket.on('set-info',data => {
        console.log(data)
        if(data.user){
          Users.push({id:socket.id,user:true,username:data.user.name,userId:data.user.id})
        }else{
          // Users.push({id:socket.id,user:false,username:"",userId:""})
        }
      })


      socket.on('set-room', roomid => {
        roomIdLet=roomid
        socket.join(roomid)
        socket.emit('room-joined',{message:"Room joined succesfully",id:socket.id})
        // console.log('HELLO')
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

        // console.log(user)
        // return

        const Coversation = user.dataValues.UserConversations;
        const Received = user.dataValues.FriendRequestReceiver;
        socket.emit('set-conversation',{conv:Coversation,friendReceived:Received})

        // console.log(conversations,user)

      })

      socket.on('disconnect', async ()=>{
        // if(roomIdLet){
        //   let usersInRoom = await io.in(roomIdLet).fetchSockets();
        //   if(usersInRoom.length==0){
        //     setTimeout(async() => {
              

        //       let usersInRoom2 = await io.in(roomIdLet).fetchSockets();
        //       if(usersInRoom2.length==0){
        //         const room = await Room.findOne({where:{token:roomIdLet}})
        //         if(room&&room.dataValues){
                  
        //           // TODO : arrèter la partie si elle est en cour est donner des résultat

        //           room.destroy();
        //         }
        //       }



        //     }, 30000);
        //   }
        // }
        Users.splice(Users.findIndex(el => el.id === socket.id), 1);
        console.log(Users)
        console.log(`client ${socket.id} disconnected..... ?${roomIdLet}`)
      })



    })
  }
  res.end()
}

export default SocketHandler

























