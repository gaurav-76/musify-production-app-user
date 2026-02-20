import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { PlayerContext, PlayerContextProvider } from './context/PlayerContext.jsx'
import { SearchProvider } from './context/SearchContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PlayerContextProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </PlayerContextProvider>
    </AuthProvider>
  </BrowserRouter>
)
