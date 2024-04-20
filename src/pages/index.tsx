
// import { Hero } from "../components/core/Hero";
// import { FeaturesCards } from "../components/core/Features";
// import  io  from 'socket.io-client'
// import { useEffect } from "react";


// const Home = () => {

//   //@ts-ignore
//   // let socket

//   // const socketInitializer=async ()=>{
//   //     await fetch('/api/socket')
//   //     socket=io()
//   //     socket.on('test',()=>{
//   //       console.log('bahahahah')
//   //     })
//   //     // socket.emit("test", "world");
//   //     console.log(socket)

//   //     // setTimeout(() => {
//   //     //   //@ts-ignore
//   //     // }, 5000);
//   // }

//   // useEffect(()=>{

//   //   socketInitializer()

//   //   // socket.emit("test", "world");

//   // },[])

//   // let socket

//   // useEffect(() => {
//   //     // initialize your socket
//   //     socket = io('/api/socketio');

//   //     socket.emit('test',{data:'a'})
//   // }, []);


//   return (
//     <>
//       <div>
        
//         <span>Stockage all your data</span>

//         {/* <button onClick={()=>{socket.emit('test',{data:'a'})}}>Test</button> */}

//       </div>
//     </>
//   );
// }

// export default Home;


import { useEffect, useRef, useState } from 'react'
// import { useTestContext } from '@/context/test/main';

const Home = () => {

  // const x = useTestContext()
      
  useEffect(()=>{
    // console.log(x)
  },[])

  return (
    <div>
      aa
    </div>
  )
}

export default Home;