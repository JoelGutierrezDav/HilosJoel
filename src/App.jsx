import { useState, useEffect } from 'react'
import AuthPage      from './pages/AuthPage'
import InventoryPage from './pages/InventoryPage'
import Sidebar       from './components/Sidebar'
import { getProducts, subscribeToProducts } from './db/storage'

export default function App() {
  const [view,        setView]        = useState('auth')
  const [currentUser, setCurrentUser] = useState(null)
  const [products,    setProducts]    = useState([])
  const [loading,     setLoading]     = useState(true)

  // Restaurar sesión al recargar
  useEffect(() => {
    const saved = sessionStorage.getItem('hj_currentUser')
    if (saved) {
      setCurrentUser(JSON.parse(saved))
      setView('dashboard')
    }
    setLoading(false)
  }, [])

  // Suscripción en tiempo real cuando el usuario está logueado
  useEffect(() => {
    if (view !== 'dashboard') return
    const unsub = subscribeToProducts((prods) => setProducts(prods))
    return () => unsub()
  }, [view])

  const handleLogin = async (user) => {
    setCurrentUser(user)
    sessionStorage.setItem('hj_currentUser', JSON.stringify(user))
    const prods = await getProducts()
    setProducts(prods)
    setView('dashboard')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('hj_currentUser')
    setCurrentUser(null)
    setProducts([])
    setView('auth')
  }

  if (loading) return null

  if (view === 'auth') {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <Sidebar user={currentUser} onLogout={handleLogout} />
      <div className="main">
        <InventoryPage
          products={products}
          onProductsChange={setProducts}
        />
      </div>
    </div>
  )
}