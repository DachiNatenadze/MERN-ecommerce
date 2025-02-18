/* eslint-disable @typescript-eslint/no-explicit-any */
import Account from './pages/Account'
import AdminPage from './pages/AdminPage'
import LandPage from './pages/LandPage'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import { useContext, useEffect, useState } from 'react'
import { userContext } from './components/UserContext.jsx'
import UserSigned from './pages/UserSigned.js'
import Cart from './pages/Cart.js'
import { motion } from 'framer-motion'

const App = () => {
  const { user } = useContext<any>(userContext)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleMouseOut = () => {
      setMousePosition({ x: 20, y: 20 })
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <main>
      <motion.div
        animate={{
          x: mousePosition.x - 15,
          y: mousePosition.y - 15,
        }}
        className='cursor h-[40px] w-[40px] fixed rounded-full mix-blend-difference pointer-events-none bg-white z-[999] max-lg:hidden'
      ></motion.div>
      <Routes>
        <Route path='/' element={<LandPage />} />
        <Route path='/admin' element={<AdminPage />} />
        {!user ? (
          <>
            <Route path='/account' element={<Account />} />
            <Route path='/account/register' element={<Register />} />
          </>
        ) : (
          <Route path='/account' element={<UserSigned />} />
        )}
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </main>
  )
}

export default App
