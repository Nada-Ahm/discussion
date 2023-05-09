import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './shared/Header';
import Footer from './shared/Footer';
function App() {
  return (
    <div className="App">
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  );
}

export default App;
