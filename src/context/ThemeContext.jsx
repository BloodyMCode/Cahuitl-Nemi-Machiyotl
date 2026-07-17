import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
        } catch (e) {
            return 'dark';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error("No se pudo guardar el tema en localStorage", e);
        }

        // Aplicamos las clases en el body
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
    }
    return context;
};
