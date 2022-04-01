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
import ErrorMessage from "./error";
import SearchUsersList from "./searchusers";
import {onError} from '@apollo/client/link/error'
import Comments from './comments.js'
import { 
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  from,
  ApolloClient
} from '@apollo/client'

const errorLink = onError(({graphqlErrors, networkError}) => {
  if(graphqlErrors){
    graphqlErrors.map(({message, location, path}) => {
     return console.log(message,location,path)
    })
  }
  if(networkError){
    console.log(networkError)
  }
})
function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, new HttpLink({uri: ' https://roast-people.herokuapp.com/graphql'})])
  })
  return (
    <div>
      <ApolloProvider client={client}>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400&display=swap');
        </style>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:id" element={<SendMessage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-account" element={<CreateAcc />} />
          <Route path="/edit-post/" element={<EditPost />} />
          <Route path="/select" element={<Select />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Othersprofile />} />
          <Route path="/search" element={<SearchUsersList />} />
          <Route path="/error-page" element={<ErrorMessage />} />
          <Route path="/post/comments/:id" element={<Comments />} />
          <Route path="*" element={<ErrorMessage />} />
        </Routes>
      </ApolloProvider>
    </div>
  );
}

export default App;
