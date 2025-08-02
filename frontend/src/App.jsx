import './App.scss';
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Viewer from './Viewer'
import Test from './Test'

function App() {
  return (
    <>
        <div className="star-layers">
          <div className="star-layer" id="stars"></div>
          <div className="star-layer" id="stars2"></div>
          <div className="star-layer" id="stars3"></div>
        </div>
      <div className='p-3'>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/view/:table" element={<Viewer />}></Route>
            {/* <Route path="/test" element={<Test/>}></Route> */}
        </Routes>

      </div>
    </>
  );

} export default App;