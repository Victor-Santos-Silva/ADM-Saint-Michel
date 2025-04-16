import React, { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('darkMode')
      return savedMode ? JSON.parse(savedMode) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      document.body.className = isDarkMode ? 'dark-mode' : 'light-mode'
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    } catch (error) {
      console.error('Erro ao persistir tema:', error)
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}