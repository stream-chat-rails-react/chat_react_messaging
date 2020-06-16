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

let chatClient;
function App() {
  const [channel, setChannel] = useState(null);
  const [auth, setAuth] = useState('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login() {
    const payload = {
      name: {
        first: firstName,
        last: lastName,
      },
      email: email,
      password: password,
    };

    try {
      const response = await axios.get(
        "https://ruby-chat-stream.herokuapp.com/api/v1/auth",
        payload
      );

      const { apiKey, user, token } = response.data;
      chatClient = new StreamChat(apiKey);
      await chatClient.setUser(
        {
          id: user._id,
          name: user.name.first,
          role: 'admin',
        },
        token
      );

      const channel = chatClient.channel('messaging', 'General');
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
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      login={login}
    />
  );
}

export default App;
