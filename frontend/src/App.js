import React from 'react';
import { Route } from 'react-router-dom'
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import './index.css';
import Signup from './Pages/Signup';
import Login from './Pages/Login';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </div>
  );
}

export default App;
