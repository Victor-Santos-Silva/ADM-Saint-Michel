import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext'
import router from './router/router.jsx'
import { ToastContainer } from 'react-toastify'

// Verifique se o elemento root existe
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Elemento root não encontrado')

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)