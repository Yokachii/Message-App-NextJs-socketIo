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
import DiscordButton from "@/components/core/Login/googleButton";
import { useSearchParams } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"


const login = (props: PaperProps) => {
  
  let search = `a`

  const { data: session } = useSession()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm({
    initialValues: {
      email: search?search:``,
      // name: "",
      username:"",
      firstname:"",
      lastname:"",
      password: "",
      terms: true,
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val: string) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });

  const handleLogin = async (email:string,password:string,username:string,firstname:string,lastname:string,) => {

    const newUser = {email,password,username,firstname,lastname,};

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if(data.success){
      await signIn('credentials', {
        // redirect: false,
        email,
        password,
      })
    }
    

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

        {session?.user?(
          <p>non</p>
        ):(
          <Paper radius="md" p="xl" withBorder {...props}>
          <Text size="lg" fw={500}>
            Welcome to Oxie, Register with
          </Text>

          {/* <Group grow my="md">
            <DiscordButton radius="xl">Discord</DiscordButton>
          </Group> */}

          <Divider label="Or continue with email (only Oxie SSO users)" labelPosition="center" my="lg" />

          <form onSubmit={form.onSubmit((e) => {handleLogin(e.email,e.password,e.username,e.firstname,e.lastname)})}>
            <Stack>

              <TextInput
                required
                label="Username"
                placeholder="axo"
                value={form.values.username}
                onChange={(event) => form.setFieldValue("username", event.currentTarget.value)}
                error={form.errors.username && "Invalid username"}
                radius="md"
              />

              <TextInput
                required
                label="FirstName"
                placeholder="axo"
                value={form.values.firstname}
                onChange={(event) => form.setFieldValue("firstname", event.currentTarget.value)}
                error={form.errors.firstname && "Invalid firstname"}
                radius="md"
              />


              <TextInput
                required
                label="LastName"
                placeholder="axo"
                value={form.values.lastname}
                onChange={(event) => form.setFieldValue("lastname", event.currentTarget.value)}
                error={form.errors.lastname && "Invalid lastname"}
                radius="md"
              />

              <TextInput
                required
                label="Email"
                placeholder="john.doe@oxie.fr"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password && "Password should include at least 6 characters"}
                radius="md"
              />
            </Stack>

            <Group justify="center" mt="xl">
              <Button type="submit" radius="xl">
                {upperFirst("login")}
              </Button>
            </Group>
          </form>
        </Paper>
        )}
        
      </div>
    </>
  );
};

export default login;
