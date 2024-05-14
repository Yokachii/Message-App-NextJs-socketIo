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
    const [MessageObj,setMessageObj] = useState<Record<string,ChatItemType>>({})
    const [inputValue,setInputValue] = useState('')

    const sortByTimestamp = (obj:Record<string,ChatItemType>) => {
      let xTmp = []
      for (let item in obj){
        xTmp.push([item,obj[item].created_at,obj[item]])
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
          
          // console.log(data)

          const {sent_to,sent_by,message} = data

          console.log("received")

          let newObj = MessageObj
          newObj[message.id] = message

          setMessageObj(newObj);
          console.log(MessageObj)
        })

        //@ts-ignore
        // socketRef.current.on(`sended-succes`,(data:ChatItemType)=>{
          
        //   setMessageObj(prevSearchItemArray => {
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

        // console.log(info.FriendShipMessages)

        let newMsgObj = info.FriendShipMessages.reduce(function(result:any, item:any, index:any, array:any) {
          result[item.id] = item;
          return result;
        }, {})

        console.log(newMsgObj)

        setMessageObj(newMsgObj)

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
    const sortedMessage = sortByTimestamp(MessageObj)

    console.log(sortedMessage)
    
    return(
        <div>
          SALUT
          <div>
            {/* {JSON.stringify(MessageObj)} */}
            {sortedMessage.map((item,i)=>(
              <div className={`${styles.msg} ${user?.id==item.sender_id?`${styles.message_our}`:`${styles.message_not_our}`}`}>
                {item.message} <Button onClick={async ()=>{
                  const response = await fetch('/api/messages/delete', {
                      method: 'POST',
                      body: JSON.stringify({id:item.id}),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                  });

                const data = await response.json();

                if(data.success){
                  let newMsgObj = MessageObj
                  console.log(newMsgObj[item.id])
                  delete newMsgObj[item.id]
                  console.log(newMsgObj[item.id])
                  newMsgObj.cow = {id:'a'}
                  console.log(newMsgObj,item.id)
                  setMessageObj(newMsgObj) // WARNING TRUC QUI BUG setMessageObj({}) ça change mais si je set avec l'object ça change pas
                }

                // console.log(data)
                }}>Delete!</Button>
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
