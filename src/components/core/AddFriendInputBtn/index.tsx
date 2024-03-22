import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import ButtonStyled from '../ButtonLoad/index'
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";

type propss = {
  socket:any,
}

const login = (props: propss) => {
  
  const {socket} = props
    
    const [buttonState,setButtonState] = useState('ready')
    const [message,setMessage] = useState({text:"",state:true})

  const { data: session } = useSession()

  const form = useForm({
    initialValues: {
      username:"",
      terms: true,
    },

    validate: {
    },
  });

  const handleLogin = async (username:string) => {

    setButtonState(`load`)
    if(username){
        const response = await fetch('/api/user/addfriend', {
            method: 'POST',
            body: JSON.stringify({username,userId:session?.user.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        setMessage({text:data.message,state:data.success})
        console.log(data)
        setButtonState(`ready`)
        
        if(data.success){
            
          if(data.type==`accepted`){

            // TODO
            // socket.emit(`friend-accepted`)

          }else if(data.type==`sent`){
            const id = data.x.sended_to
            const id2 = data.x.sended_by
            //@ts-ignore
            socket.emit('sent-friend', {username:session?.user.username,userId:id,sendedId:id2})
          }
            
        }else{

        }
    }


    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   body: JSON.stringify(newUser),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    // const data = await response.json();

    // if(data.success){
        
    // }
    

  }

  return (
    <>
      <div
        style={{
          maxWidth: "calc(26.25rem * var(--mantine-scale))",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >

        {!session?.user?(
          <p>non</p>
        ):(
          <Paper radius="md" p="xl" withBorder>

          <form onSubmit={form.onSubmit((e) => {handleLogin(e.username)})}>

              <TextInput
                required
                label="Username"
                placeholder="axo"
                value={form.values.username}
                onChange={(event) => form.setFieldValue("username", event.currentTarget.value)}
                error={form.errors.username && "Invalid username"}
                radius="md"
              />

                <Group justify="center" mt="xl">
                    <ButtonStyled buttonState={buttonState} onClick={()=>{}} text="Add" typevar="submit"/>
                    {message.text?(
                        <p style={{color:`${message.state?'green':'red'}`}}>{message.text}</p>
                    ):(
                        <></>
                    )}
                </Group>
          </form>
        </Paper>
        )}
        
      </div>
    </>
  );
};

export default login;
