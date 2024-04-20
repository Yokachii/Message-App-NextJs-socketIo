// import { createContext, useContext } from 'react';

// const AppContext = createContext("test");

// export function TestWrapper({ children }:any) {
//   let sharedState = {test:"a"}

//   return (
//     <AppContext.Provider value={JSON.stringify(sharedState)}>
//       {children}
//     </AppContext.Provider>
//   );
// }

import { Server } from 'Socket.IO'
import {Conversations,DeletedMessage,FriendRequest,Friendship,Messages,MessagesDm,Participants,User} from '@/module/association'
import { createContext, useContext, useState } from 'react';

// const AppContext = createContext("salut");

interface SocketContextType {
    socket: Server | null;
}

const AppContext = createContext<SocketContextType>({ socket: null });

export function TestWrapper({children}:any) {

    const io = new Server()

    io.on('connection', async (socket) => {

        console.log(socket,"aaaaaaaa")

        socket.on('disconnect', async ()=>{
            console.log(`client ${socket.id} disconnected.....`)
        })

    })
    
    return (
        <AppContext.Provider value={{socket:io}}>
            {children}
        </AppContext.Provider>
  );
}

export function useTestContext() {
  return useContext(AppContext);
}

// import { createContext, useContext } from 'react';
// import { Server } from 'socket.io';

// interface SocketContextType {
//     socket: Server | null;
// }

// const SocketContext = createContext<SocketContextType>({ socket: null });

// export function TestWrapper({ children }: { children: React.ReactNode }) {
//     const io = new Server();

//     return (
//         <SocketContext.Provider value={{ socket: io }}>
//             {children}
//         </SocketContext.Provider>
//     );
// }

// export function useTestContext() {
//     const context = useContext(SocketContext);
//     if (!context) {
//         throw new Error('useSocket must be used within a SocketProvider');
//     }
//     return context.socket;
// }