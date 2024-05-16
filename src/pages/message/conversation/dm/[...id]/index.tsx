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
    const [inputValue,setInputValue] = useState('')
    
    const [messagesArray,setMessagesArray] = useState<Array<ChatItemType>>([])

    const addMessage = (mess:ChatItemType) => {
      setMessagesArray(prevMessages => [...prevMessages, mess]);
    }

    const removeMessage = (mess:ChatItemType) => {
      setMessagesArray(prevMessages => prevMessages.filter(message => message.id !== mess.id));
    }

    const sortArray = (tab:Array<ChatItemType>) => {
      let xTmp = []
      for (let item in tab){
        xTmp.push([item,tab[item].created_at,tab[item]])
      }
      xTmp.sort(function(a, b) {
        return a[1] - b[1];
      });
      return xTmp.map(x=>{return x[2]})
    }
  
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
        
          const {sent_to,sent_by,message} = data
          
          addMessage(message)
        })

        //@ts-ignore
        socketRef.current.on(`sended-succes`,(data:ChatItemType)=>{

          addMessage(data)
        })

    }

    const fetchRoom = async () => {
        // Fetch the api
        const response = await fetch('/api/messages/getmessagedm', {
            method: 'POST',
            body: JSON.stringify({id1:user?.id,id2:id,from:0,to:10}),
            headers: {
              'Content-Type': 'application/json',
            },
        });

      const data = await response.json();

      if(data.success){

        let arrayTmp = data.messagesArray
        setMessagesArray(arrayTmp)

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
          console.log('loaded socket')
          fetchRoom()
          socketInitializer()
        }
    },[router.isReady,session])

  if(isRoomExist){
    
    return(
        <div>
          SALUT
          <div className={styles.message_container}>
            {/* {JSON.stringify(MessageObj)} */}
            {sortArray(messagesArray).map((item,i)=>(
              <div className={`${styles.msg} ${user?.id==item.sender_id?`${styles.message_our}`:`${styles.message_not_our}`}`}>
                <span>{item.message}</span>
                <button className={styles.dlt} onClick={async ()=>{
                  const response = await fetch('/api/messages/delete', {
                      method: 'POST',
                      body: JSON.stringify({id:item.id}),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                  });

                const data = await response.json();

                if(data.success){

                  removeMessage(item)

                }

                }}>❌</button>
              </div>
            ))}

            <div className={styles.status}>
                {sortArray(messagesArray)[messagesArray.length-1].status}
            </div>

            
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
