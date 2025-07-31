import './App.scss';
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Viewer from './Viewer'

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/view/:table" element={<Viewer />}></Route>
        </Routes>
    </>
  );

} export default App;