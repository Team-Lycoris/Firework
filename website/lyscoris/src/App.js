import logo from './logo.svg';
import './App.css';

import Home from './pages';
import Authenticate from './pages/login';
import MessagesPage from './pages/messages';

function App() {
  return (
    <div>
      <MessagesPage />
    </div>
  );
}

export default App;
