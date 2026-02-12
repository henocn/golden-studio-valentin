import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Room from './pages/Room'

function ProtectedRoute({ children }) {
  const { player } = useAuth()
  if (!player) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ children }) {
  const { player } = useAuth()
  if (player) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:code"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
