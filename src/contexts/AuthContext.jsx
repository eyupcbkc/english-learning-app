import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function register(email, password, displayName) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)

    // Set display name
    await updateProfile(newUser, { displayName })

    // Create user document in Firestore
    await setDoc(doc(db, 'users', newUser.uid), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      level: 'A1',
    })

    return newUser
  }

  async function login(email, password) {
    const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password)
    return loggedUser
  }

  async function logout() {
    await signOut(auth)
  }

  async function getUserProfile() {
    if (!user) return null
    const snap = await getDoc(doc(db, 'users', user.uid))
    return snap.exists() ? snap.data() : null
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    getUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
