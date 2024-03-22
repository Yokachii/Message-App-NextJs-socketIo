"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import AddFriend from '@/components/core/AddFriendInputBtn/index'
import { Notifications, notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";

type props = {
    invite:Record<string,string>,
    user:any,
}

import { IconCheck } from "@tabler/icons-react";

const ShowNotif = (data:props)=>{
    const {invite,user} = data
    let isLoading = false

    let ids = notifications.show({loading:isLoading,autoClose:false,title:`New friend request`,message:(
        <div>
          <span>You received a friend request from "${invite.username}"</span>
          <button className={styles.btn_add}><IconCheck color="green" size={34} onClick={async()=>{
            isLoading = true
            const response = await fetch('/api/user/acceptpending', {
                method: 'POST',
                body: JSON.stringify({sended_by:invite.id,sended_to:user?.id}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            
            if(data.success){
                notifications.hide(ids)
            }else{
            }
            
          }}/></button>
        </div>
    )})
}

export {ShowNotif}