import Navbar from './components/Navbar'

function App() {
  return (
    <main className="min-h-screen bg-[#fdfcfc]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-[#ECE8F5] bg-white/80 p-8 shadow-sm sm:p-12">
          <p
            className="text-sm uppercase tracking-[0.28em] text-[#4C2C92]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Hotel Management
          </p>
          <h1
            className="mt-4 text-3xl text-[#1B1732] sm:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Premium stays, modern operations.
          </h1>
          <p
            className="mt-4 max-w-2xl text-base text-[#4A4461] sm:text-lg"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Your Vivanta-style navbar is now active with Redux-powered state and
            responsive behavior. We can now connect each menu item to your app
            routes and backend modules.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
