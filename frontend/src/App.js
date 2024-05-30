import { Route } from 'react-router-dom';
import './App.css';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className="App">
      Welcome!!
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
