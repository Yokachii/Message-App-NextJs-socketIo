"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import styles from './styles.module.scss'
import { getSession, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { Button } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

type ChatItemType = {
  message:string,
  sender_id:string,
  created_at:any,
  id:string,
}

type NewMess = {
  sent_to:string,
  sent_by:string,
  message:ChatItemType,
}

export default function Room() {

    const router = useRouter()
    const { id } = router.query

    let session = useSession()
    let data = session.data
    let user = data?.user

    const [socketId,setSocketId] = useState('')
    const socketRef = useRef(null)
    const [isRoomExist,setIsRoomExist] = useState(false)
    const [messageArray,setMessageArray] = useState<Array<ChatItemType>>([])
    const [inputValue,setInputValue] = useState('')
  
    const socketInitializer = async () => {

        await fetch('/api/socket');
        //@ts-ignore
        socketRef.current = io();
        //@ts-ignore
        socketRef.current.on('set-socket', (data:string) => {
            setSocketId(data)
            //@ts-ignore
            socketRef.current.emit('set-info', {user})
        })

        //@ts-ignore
        socketRef.current.on('new-message',(data:NewMess)=>{
          
          // console.log(data)

          const {sent_to,sent_by,message} = data

          console.log("received")

          let truc = [...messageArray, [message]]
          console.log([message])
          console.log(messageArray)
          console.log(truc)
          //@ts-ignore
          setMessageArray(truc);
          console.log(messageArray)
        })

        //@ts-ignore
        // socketRef.current.on(`sended-succes`,(data:ChatItemType)=>{
          
        //   setMessageArray(prevSearchItemArray => {
        //     const newSearchItemArray = [...prevSearchItemArray, data];
        //     return newSearchItemArray;
        //   });
        // })

    }

    const fetchRoom = async () => {
        // Fetch the api
        const response = await fetch('/api/messages/getmessagedm', {
            method: 'POST',
            body: JSON.stringify({id1:user?.id,id2:id}),
            headers: {
              'Content-Type': 'application/json',
            },
        });

      const data = await response.json();

      if(data.success){

        const info = data.friendConv
        console.log(info.FriendShipMessages)
        setMessageArray(info.FriendShipMessages)
        setIsRoomExist(true)
        //SET INFO

      }else{

        setIsRoomExist(false)

      }
    }

    async function sendAMessage(){
      console.log('send')
      //@ts-ignore
      socketRef.current.emit("message-sent-to-dm",{sent_by:user?.id,sent_to:id,content:inputValue})
    }



    useEffect(()=>{
        if(!router.isReady) return;

        if(user){
          fetchRoom()
          socketInitializer()
        }
    },[router.isReady,session])

  if(isRoomExist){
    
    return(
        <div>
          SALUT
          <div>
            {/* {JSON.stringify(messageArray)} */}
            {messageArray.map((item,i)=>(
              <div className={`${user?.id==item.sender_id?`${styles.message_our}`:`${styles.message_not_our}`}`}>
                {item.message}
              </div>
            ))}
          </div>

          <input onChange={(e)=>{setInputValue(e.target.value)}}></input>
          <Button leftSection={<IconSend></IconSend>} onClick={()=>{
            sendAMessage()  
          }}>Send</Button>
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
