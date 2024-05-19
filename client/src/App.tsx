import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import ApplyKYC from './pages/ApplyKYC';
import ShareKYC from './pages/ShareKYC';
import SelectEntity from './pages/SelectEntity'
import RegisterBank from './pages/RegisterBank';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<Home />} />
        <Route  path="/applyKYC" element={ <ApplyKYC />  } />
        <Route  path="/shareKYC" element={ <ShareKYC />  } />
        <Route path="/selectEntity" element={ <SelectEntity />} />
        <Route path="/agentKYC" element={ <RegisterBank />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
