"use client";
import { useEffect, useRef, useState } from "react";
import io from 'Socket.IO-client'
import styles from './styles.module.scss'
import { getSession, useSession } from "next-auth/react";
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

import { GetServerSidePropsContext } from "next";

export default function Room() {

    let session = useSession()
    let data = session.data
    let user = data?.user

    const socketRef = useRef(null);
    const [friendsDisplay,setFriendsDisplay] = useState<Array<User>>([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [groupName,setGroupName] = useState(``);


    const handleCheckboxChange = (event:any) => {
        const checkedId = event.target.value;
        if(event.target.checked){
            //@ts-ignore
            setSelectedIds([...selectedIds,checkedId])
        }else{
            setSelectedIds(selectedIds.filter(id=>id !== checkedId))
        }
    }
  
    const socketInitializer = async () => {

        await fetch('/api/socket');
        //@ts-ignore
        socketRef.current = io();
        //@ts-ignore
        socketRef.current.on('set-socket', (data:string) => {
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
        
        if(data.success){

          const {friends} = data
          console.log(friends)
          setFriendsDisplay(friends)
          
        }
    }

    useEffect(()=>{

        if(session&&session?.data?.user){

          socketInitializer()
          fetchData()
          
        }
    },[])

  if(user){
    
    return(
        <div>
          <div className={styles.list}>
            {friendsDisplay.map((item,i)=>(
                <div className={styles.item} key={i}>
                      <input
                        className={styles.check}
                        type="checkbox"
                        value={item.id}
                        id={item.id}
                        name={item.id}
                        //@ts-ignore
                        checked={selectedIds.includes(item.id)}
                        onChange={(event) => { handleCheckboxChange(event) }}
                        />
                        <label htmlFor={item.id}>{item?.username}</label>
                </div>
            ))}
          </div>
          <input type="text" onChange={(e)=>{setGroupName(e.target.value)}} placeholder="Group's name"/>
          <Button onClick={()=>{
            console.log(selectedIds)
            //@ts-ignore
            socketRef?.current.emit(`create-group`,{
                userIds:selectedIds,
                groupName:groupName?groupName:null,
                groupOwner:user?.id,
            })
          }}>Create the group</Button>
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
