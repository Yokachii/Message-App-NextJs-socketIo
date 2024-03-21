import { Server } from 'Socket.IO'
import { parse } from '@mliebelt/pgn-parser'
import {Room,User,Study} from '@/module/association'

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', async (socket) => {
      let roomIdLet


      socket.emit('set-socket', socket.id)


      socket.on('set-room', roomid => {
        roomIdLet=roomid
        socket.join(roomid)
        socket.emit('room-joined',{message:"Room joined succesfully",id:socket.id})
      })

      socket.on('disconnect', async ()=>{
        if(roomIdLet){
          let usersInRoom = await io.in(roomIdLet).fetchSockets();
          if(usersInRoom.length==0){
            setTimeout(async() => {
              

              let usersInRoom2 = await io.in(roomIdLet).fetchSockets();
              if(usersInRoom2.length==0){
                const room = await Room.findOne({where:{token:roomIdLet}})
                if(room&&room.dataValues){
                  
                  // TODO : arrèter la partie si elle est en cour est donner des résultat

                  room.destroy();
                }
              }



            }, 30000);
          }
        }
        console.log(`client ${socket.id} disconnected..... ?${roomIdLet}`)
      })



    })
  }
  res.end()
}

export default SocketHandler

























