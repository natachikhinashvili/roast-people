import { Routes, Route } from "react-router-dom";
import React from 'react';
import SendMessage from './chat/sendmessage';
import Settings from './settings/settings';
import CreateAcc from './login/create-acc';
import EditPost from './create-post/editpost';
import Select from "./select/selec-main";
import Profile from "./userprofile/profile";
import Feed from "./feed/feed";
import Login from "./login/login";
import ChatList from "./chat/chat-list";
import Main from "./main";
import Othersprofile from "./userprofile/otherprofile";
import MeetingList from "./chat/videochat/meeting-list";
import EditRoom from "./chat/videochat/edit-meeting";
import ErrorMessage from "./error";
function App() {
  return (
    <div>
      <style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans&display=swap');
    </style>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:id" element={<SendMessage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-account" element={<CreateAcc />} />
        <Route path="/edit-post/:status" element={<EditPost />} />
        <Route path="/select" element={<Select />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Othersprofile />} />
        <Route path="/meetings" element={<MeetingList />} />
        <Route path="/create-room/:id" element={<EditRoom />} />
        <Route path="/error-page" element={<ErrorMessage />} />
      </Routes>
    </div>
  );
}

export default App;
