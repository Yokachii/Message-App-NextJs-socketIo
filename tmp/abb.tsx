import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import io from 'socket.io-client';

type ChatItemType = {
  message: string;
  sender_id: string;
  created_at: any;
  id: string;
};

type NewMess = {
  sent_to: string;
  sent_by: string;
  message: ChatItemType;
};

export default function Room() {
  const router = useRouter();
  const { id } = router.query;

  const session = useSession();
  const data = session.data;
  const user = data?.user;

  const [socketId, setSocketId] = useState('');
  const socketRef = useRef(null);
  const [isRoomExist, setIsRoomExist] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messagesArray, setMessagesArray] = useState<Array<ChatItemType>>([]);

  const addMessage = (mess: ChatItemType) => {
    setMessagesArray(prevMessages => [...prevMessages, mess]);
  };

  const removeMessage = (mess: ChatItemType) => {
    setMessagesArray(prevMessages => prevMessages.filter(message => message.id !== mess.id));
  };

  const sortArray = (tab: Array<ChatItemType>) => {
    return tab.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socketRef.current = io();

    socketRef.current.on('set-socket', (data: string) => {
      setSocketId(data);
      socketRef.current.emit('set-info', { user });
    });

    socketRef.current.on('new-message', (data: NewMess) => {
      const { message } = data;
      addMessage(message);
    });

    socketRef.current.on('sended-succes', (data: ChatItemType) => {
      addMessage(data);
    });
  };

  const fetchRoom = async () => {
    const response = await fetch('/api/messages/getmessagedm', {
      method: 'POST',
      body: JSON.stringify({ id1: user?.id, id2: id, from: 0, to: 10 }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      setMessagesArray(data.messagesArray);
      setIsRoomExist(true);
    } else {
      setIsRoomExist(false);
    }
  };

  const sendAMessage = async () => {
    socketRef.current.emit("message-sent-to-dm", { sent_by: user?.id, sent_to: id, content: inputValue });
  };

  useEffect(() => {
    if (!router.isReady || !user) return;
    
    fetchRoom();
    socketInitializer();
  }, [router.isReady, user]);

  if (!isRoomExist) {
    return <div>This conversation does not exist</div>;
  }

  return (
    <div>
      SALUT
      <div className={styles.message_container}>
        {sortArray(messagesArray).map((item, i) => (
          <div key={item.id} className={`${styles.msg} ${user?.id == item.sender_id ? styles.message_our : styles.message_not_our}`}>
            <span>{item.message}</span>
            <button className={styles.dlt} onClick={async () => {
              const response = await fetch('/api/messages/delete', {
                method: 'POST',
                body: JSON.stringify({ id: item.id }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const data = await response.json();

              if (data.success) {
                removeMessage(item);
              }
            }}>❌</button>
          </div>
        ))}
      </div>
      <input onChange={(e) => setInputValue(e.target.value)}></input>
      <button onClick={sendAMessage}>Send</button>
    </div>
  );
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
  }

  return {
    props: { session },
  };
}