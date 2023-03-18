import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import ProductionFlow from './components/ProductionFlow'

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/production-flow'
          element={
            isAuthenticated() ? <ProductionFlow /> : <Navigate to='/login' />
          }
        />
      </Routes>
    </Router>
  )
}

export default App
