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

class stockMessages {
  messageArray : Array<ChatItemType>;

  constructor(messagesArray:Array<ChatItemType>) {
    this.messageArray = messagesArray
  }

  get getMessagesArray() {
    return this.messageArray
  }

  get getMessagesObject() {
    return this.messagesObject()
  }

  get getLastMessage() {
    return this.lastMessage()
  }

  get getSortedMessageArray() {
    return this.sortedArray()
  }

  messagesObject() {
    let newMsgObj = this.messageArray.reduce(function(result:any, item:any, index:any, array:any) {
      result[item.id] = item;
      return result;
    }, {})
    return newMsgObj
  }

  sortedArray() {
    let xTmp = []
    for (let item in this.messageArray){
      xTmp.push([item,this.messageArray[item].created_at,this.messageArray[item]])
    }
    xTmp.sort(function(a, b) {
      return a[1] - b[1];
    });
    return xTmp.map(x=>{return x[2]})
  }

  lastMessage() {
    let sorted = this.sortedArray()
    let lastMessage = sorted[sorted.length-1]
    return lastMessage
  }

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
    
    const [messageInstance,setMessageInstance] = useState<stockMessages>(new stockMessages([]))

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

          let newObj = messageInstance.getMessagesArray
          newObj.push(message)
          setMessageInstance(new stockMessages(newObj))
          console.log(messageInstance.getMessagesObject)
        })

        //@ts-ignore
        socketRef.current.on(`sended-succes`,(data:ChatItemType)=>{
          let newObj = messageInstance.getMessagesArray
          newObj.push(data)
          setMessageInstance(new stockMessages(newObj))
          console.log(messageInstance.getMessagesObject)
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

        // const info = data.friendConv
        let messagesArray = data.messagesArray
        setMessageInstance(new stockMessages(messagesArray))

        // console.log(info.FriendShipMessages)

        // let newMsgObj = messagesArray.reduce(function(result:any, item:any, index:any, array:any) {
        //   result[item.id] = item;
        //   return result;
        // }, {})

        // setMessagesArray(newMsgObj)

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

    function testTmp(){
      //@ts-ignore
      socketRef.current.emit('trya',{id:id})
      console.log('test2')
    }



    useEffect(()=>{
        if(!router.isReady) return;

        if(user){
          console.log('aa')
          fetchRoom()
          socketInitializer()
        }
    },[router.isReady,session])

  if(isRoomExist){

    console.log(messageInstance.getSortedMessageArray)

    console.log(messageInstance.getSortedMessageArray[messageInstance.getSortedMessageArray.length-1])
    console.log('aaaaaa')
    
    return(
        <div>
          SALUT
          <Button onClick={()=>{
            testTmp()
            console.log('test')
          }}>test</Button>
          <div>
            {/* {JSON.stringify(MessageObj)} */}
            {messageInstance.getSortedMessageArray.map((item,i)=>(
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

                  let newObj = messageInstance.getMessagesObject
                  delete newObj[item.id]
                  let newArray = Object.values(newObj)
                  // @ts-ignore
                  setMessageInstance(new stockMessages(newArray))
                  console.log(messageInstance.getMessagesObject)
                  // let newMsgObj = MessageObj
                  // console.log(newMsgObj[item.id])
                  // delete newMsgObj[item.id]
                  // console.log(newMsgObj[item.id])
                  // console.log(newMsgObj,item.id)
                  // setMessagesArray(newMsgObj) // WARNING TRUC QUI BUG setMessageObj({}) ça change mais si je set avec l'object ça change pas
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
