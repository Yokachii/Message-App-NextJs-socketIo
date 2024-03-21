"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";

type ChatItemType = {
  name:string;
  pdp:string;
  text:string;
  date:string;
  id:string;
}

export default function Room() {

    const router = useRouter()
    const { roomid } = router.query

    let session = useSession()
    let data = session.data
    let user = data?.user

    const [socketId,setSocketId] = useState('')
    const socketRef = useRef(null)
    const [isRoomExist,setIsRoomExist] = useState(false)
    const [messageArray,setMessageArray] = useState<Array<ChatItemType>>([])
  
    const socketInitializer = async () => {

        await fetch('/api/socket');
        //@ts-ignore
        socketRef.current = io();
        //@ts-ignore
        socketRef.current.on('set-socket', (data:string) => {
            setSocketId(data)
        })

        //@ts-ignore
        socketRef.current.on('new-message',(data:ChatItemType)=>{
          if(data.id===socketId) return
          const {date,name,pdp,text} = data
          setMessageArray(prevSearchItemArray => {
            const newSearchItemArray = [...prevSearchItemArray, data];
            return newSearchItemArray;
          });
        })



    }

    const fetchRoom = async () => {
        // Fetch the room
        console.log(`fetched ${user?.email} and ${roomid}`)
        // Fetch the api
        const response = await fetch('/api/chess/getMessage', {
            method: 'POST',
            body: JSON.stringify({token:roomid}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

      const data = await response.json();

      if(data.success){

      }else{

        setIsRoomExist(false)

      }
    }



    useEffect(()=>{
        if(!router.isReady) return;

        fetchRoom()

        socketInitializer()
    },[router.isReady,session])

  if(isRoomExist){
    
    return(
        <div>
          SALUT
          <div>
            {JSON.stringify(messageArray)}
          </div>
        </div>
    )

  }else{

    return (
      <div>
        This conversation does not exist
      </div>
    )

  }
}