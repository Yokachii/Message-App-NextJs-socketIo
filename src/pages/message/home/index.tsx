"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import AddFriend from '@/components/core/AddFriendInputBtn/index'
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { ShowNotif } from "@/components/core/Notification/FriendRequest";

type ChatItemType = {
  name:string;
  pdp:string;
  text:string;
  date:string;
  id:string;
}

import { IconCheck } from "@tabler/icons-react";

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
        socketRef.current.on('friend-received', (data:Record<string,string>) => {
          console.log(data)
          notifications.hide(`Friend-Received-${data.sendedId}`)
          ShowNotif({user,invite:{username:data.username,id:data.userId}})
          // notifications.show({id:`Friend-Received-${data.sendedId}`,title:`New friend request`,message:`You received a friend request from "${data.username}"`})
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
              ShowNotif({user,invite})
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
          <AddFriend socket={socketRef.current}></AddFriend>
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