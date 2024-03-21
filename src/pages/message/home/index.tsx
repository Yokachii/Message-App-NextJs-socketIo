"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import AddFriend from '@/components/core/AddFriendInputBtn/index'
import { notifications } from "@mantine/notifications";

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
    const [conversations,setConversations] = useState<Array<Record<string,string>>>([])
    const [receivedFriend,setReceivedFriend] = useState([])
  
    const socketInitializer = async () => {

        await fetch('/api/socket');
        //@ts-ignore
        socketRef.current = io();
        //@ts-ignore
        socketRef.current.on('set-socket', (data:string) => {
            console.log('set')
            setSocketId(data)

            //@ts-ignore
            socketRef.current.emit('get-conversation', {id:user?.id})
            //@ts-ignore
            socketRef.current.emit('set-info', {user})
            
        })

        //@ts-ignore
        socketRef.current.on('set-conversation', (data:Record<string,any>) => {
            console.log('a',data)
            setReceivedFriend(data.friendReceived)
            setConversations(data.conv)
            console.log(data)
            notifications.clean()
            for(let invite of data.friendReceived){
              console.log(invite)
              notifications.show({title:`New friend request`,message:`You received a friend request from "${invite.username}"`})
            }
        })

    }

    useEffect(()=>{
        if(!router.isReady) return;

        socketInitializer()
    },[router.isReady,session])

  if(user){
    
    return(
        <div>
          <AddFriend></AddFriend>
          <div>
            {socketId}
            {/* {JSON.stringify(receivedFriend)} */}
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