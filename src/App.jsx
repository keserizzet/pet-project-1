import { NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { createContext, useEffect, useMemo, useState } from 'react'
import { auth } from './lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import './App.css'
import AuthModal from './components/AuthModal'

export const AuthContext = createContext(null)

function Layout() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState(null)
  useEffect(() => {
    setEmail(auth.currentUser?.email || null)
  }, [auth.currentUser])

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/nannies" className="nav-link">Nannies</NavLink>
          <NavLink to="/favorites" className="nav-link">Favorites</NavLink>
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {email ? (
            <>
              <span>{email}</span>
              <button onClick={() => signOut(auth)}>Logout</button>
            </>
          ) : (
            <button onClick={() => setOpen(true)}>Login / Sign up</button>
          )}
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function HomePage() {
  return (
    <section>
      <h1>NannyCare</h1>
      <p>Trustworthy nannies for your family.</p>
      <NavLink to="/nannies" className="cta">Explore Nannies</NavLink>
    </section>
  )
}

import NanniesPage from './pages/NanniesPage'
import FavoritesPage from './pages/FavoritesPage'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => ({
    currentUser,
    authLoading,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
  }), [currentUser, authLoading])

  return (
    <AuthContext.Provider value={value}>
      <Routes>
        <Route element={<Layout />}> 
          <Route index element={<HomePage />} />
          <Route path="nannies" element={<NanniesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}
