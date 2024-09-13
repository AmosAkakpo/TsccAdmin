import { useState,useEffect } from 'react'
import CarbonCredit from './assets/pages/Carbon Credit Estimation/CarbonCredit'
import CarbonEstimation from './assets/pages/Carbon estimation/CarbonEstimation'
import Identification from './assets/pages/Tree Species Identification/Identification'
import Navbar from './assets/components/Navbar'
import Leftbar from './assets/components/Leftbar'
import { Routes,Route } from 'react-router-dom'
import Login from './assets/components/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <div className='flex flex-row h-[70vh] border-b-2'>
        <Leftbar/>
        <Routes>
          <Route path='/' element={<CarbonCredit/>}/>
          <Route path='/carboncredit' element={<CarbonCredit/>}/>
          <Route path='/carbonestimation' element={<CarbonEstimation/>}/>
          <Route path='/identification' element={<Identification/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
