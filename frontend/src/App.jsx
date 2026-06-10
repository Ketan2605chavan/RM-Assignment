import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import UploadZone from './components/UploadZone'
import History from './pages/History'

function Navbar() {
  const location = useLocation()

  return (
    <nav style={styles.nav}>
      <div style={styles.navBrand}>⚡ RM Engine</div>
      <div style={styles.navLinks}>
        <Link
          to="/"
          style={{
            ...styles.navLink,
            background: location.pathname === '/' ? '#4F46E5' : 'transparent',
            color: location.pathname === '/' ? 'white' : '#6B7280',
          }}
        >
          Upload
        </Link>
        <Link
          to="/history"
          style={{
            ...styles.navLink,
            background: location.pathname === '/history' ? '#4F46E5' : 'transparent',
            color: location.pathname === '/history' ? 'white' : '#6B7280',
          }}
        >
          History
        </Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadZone />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#4F46E5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  navLinks: {
    display: 'flex',
    gap: '0.5rem',
  },
  navLink: {
    padding: '0.5rem 1.25rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    transition: 'all 0.2s',
  },
}

export default App