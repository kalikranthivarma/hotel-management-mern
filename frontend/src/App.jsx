import Navbar from './components/Navbar'
import './App.css'
import Register from './pages/Register'

function App() {
  return (
    <main className="min-h-screen bg-[#fdfcfc]">
      <Navbar />
      <section className="app-shell">
        <Register />
      </section>
    </main>
  )
}

export default App
