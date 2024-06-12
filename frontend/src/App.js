import logo from './logo.svg';
import './App.css';
import { Demo } from './components/demo'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className='vw-100 vh-100' style={{ backgroundImage: "url(/image.jpg)", backgroundPosition: "center", backgroundSize: "1024px" }}>
        <Demo></Demo>
      </div>
    </BrowserRouter>
  );
}

export default App;
