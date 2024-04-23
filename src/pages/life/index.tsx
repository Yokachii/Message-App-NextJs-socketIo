"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import styles from './styles.module.scss'
import { getSession, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { Button } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

export default function Room() {

    const baseArray = []

    const [lifeArray,setLifeArray] = useState([])

    useEffect(()=>{
        
    })


    return (
      <div>
        This conversation does not exist
      </div>
    )
}
