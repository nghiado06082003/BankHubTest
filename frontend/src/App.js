import logo from './logo.svg';
import './App.css';
import { Demo } from './components/demo'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Demo></Demo>
    </BrowserRouter>
  );
}

export default App;
