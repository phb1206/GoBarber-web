import React, { createContext, useCallback, useContext, useState } from 'react';
import { tokenToString } from 'typescript';
import api from '../services/api';

interface AuthState {
    token: string;
    user: object;
}

interface AuthContextDTO {
    user: object;
    signIn(data: SignInDTO): Promise<void>;
    signOut(): void;
}

interface SignInDTO {
    email: string;
    password: string;
}

const AuthContext = createContext<AuthContextDTO>({} as AuthContextDTO);

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@GoBarber:token');
        const user = localStorage.getItem('@GoBarber:user');

        if (token && user) return { token, user: JSON.parse(user) };
        return {} as AuthState;
    });

    const signIn = useCallback(async ({ email, password }) => {
        const res = await api.post('sessions', {
            email,
            password,
        });

        const { token, user } = res.data;

        localStorage.setItem('@GoBarber:token', token);
        localStorage.setItem('@GoBarber:user', JSON.stringify(user));
        setData({ token, user });
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@GoBarber:user');
        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextDTO {
    const context = useContext(AuthContext);

    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');

    return context;
}
