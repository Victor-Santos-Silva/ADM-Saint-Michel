import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [nome, setNome] = useState(localStorage.getItem('nome') || ''); // Adiciona o estado do nome
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [id, setId] = useState(localStorage.getItem('id') || ''); // Adiciona o estado do id

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedId = localStorage.getItem('id'); // Recupera o id do localStorage
        const storeNome = localStorage.getItem('nome'); // Recupera o nome do localStorage

        if (storedToken && storedId && storeNome) {
            setToken(storedToken);
            setId(storedId); // Define o id
            setNome(storeNome); // Define
        }
    }, []);

    const login = (nome, token, id) => {
        setNome(nome); // Define o nome
        setToken(token);
        setId(id); // Define o id
        localStorage.setItem('nome', nome); // Armazena o nome no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('id', id); // Armazena o id no localStorage
    };

    const logout = () => {
        setToken('');
        setId('');
        setNome(''); // Remove o nome
        localStorage.removeItem('nome'); // Remove o nome do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('id'); // Remove o id do localStorage
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ nome, token, id, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);