"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { getSession, useSession } from "next-auth/react";
import AddFriend from '@/components/core/AddFriendInputBtn/index'
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { ShowNotif } from "@/components/core/Notification/FriendRequest";

type User = {
  username:string,
  firstname:string,
  lastname:string,
  email:string,
  id:string,
}

import { IconCheck } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";

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
    const [friendsDisplay,setFriendsDisplay] = useState<Array<User>>([])
  
    const socketInitializer = async () => {

        await fetch('/api/socket');
        //@ts-ignore
        socketRef.current = io();
        //@ts-ignore
        socketRef.current.on('set-socket', (data:string) => {
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

    const fetchData = async () => {
      const response = await fetch('/api/user/getfriend', {
            method: 'POST',
            body: JSON.stringify({id:user?.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        console.log(data)
        
        if(data.success){

          const {friends} = data
          setFriendsDisplay(friends)
          
        }
    }

    useEffect(()=>{
        if(!router.isReady) return;

        if(session&&session?.data?.user){

          socketInitializer()
          fetchData()
          
        }
    },[router.isReady,session])

  if(user){
    
    return(
        <div>
          <AddFriend socket={socketRef.current}></AddFriend>
          <div>
            {socketId}
            {JSON.stringify(friendsDisplay)}
            {friendsDisplay.map((item,i)=>(
              <Link href={`/message/conversation/dm/${item.id}`}><div key={i}>{JSON.stringify(item?.username)}</div></Link>
            ))}
          </div>
        </div>
    )

  }else{

    return (
      <div>
        Please login
      </div>
    )

  }
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
      return {
          redirect: {
              destination: "/login",
              permanent: false,
          },
      };
  } else {
    
  }

  return {
      props: { session },
  };
}
