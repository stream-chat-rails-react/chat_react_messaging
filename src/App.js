import React, { useState } from 'react';
import './App.css';
import {
  Chat,
  Channel,
  ChannelHeader,
  Thread,
  Window,
  ChannelList,
  ChannelListTeam,
  MessageList,
  MessageTeam,
  MessageInput,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import axios from 'axios';
import Auth from './Auth';

import 'stream-chat-react/dist/css/index.css';
import dotenv from 'dotenv';
dotenv.config();

let chatClient;
function App() {
  const [channel, setChannel] = useState(null);
  const [auth, setAuth] = useState('login');
  const [username, setUsername] = useState('');;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login() {
    const payload = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth",
        payload
      );

      const { id, username, token } = response.data;
      chatClient = new StreamChat(process.env.REACT_APP_STREAM_API_KEY);
      await chatClient.setUser(
        {
          id,
          username,
          role: 'admin'
        },
        token
      );

      const channel = chatClient.channel('messaging', 'Tutorial');
      await channel.watch();

      setChannel(channel);
    } catch (err) {
      console.log(err);
    }
  }

  if (channel) {
    return (
      <Chat client={chatClient} theme="messaging light">
        <ChannelList
          options={{
            subscribe: true,
            state: true,
          }}
          List={ChannelListTeam}
        />
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList Message={MessageTeam} />
            <MessageInput focus />
          </Window>
          <Thread Message={MessageTeam} />
        </Channel>
      </Chat>
    );
  }

  return (
    <Auth
      auth={auth}
      setAuth={setAuth}
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      login={login}
    />
  );
}

export default App;
