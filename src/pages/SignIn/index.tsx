import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, Background } from './style';

const SignIn: React.FC = () => (
    <Container>
        <Content>
            <img src={logoImg} alt="GoBarber" />

            <form>
                <h1>Login with e-mail</h1>
                <Input name="email" icon={FiMail} placeholder="E-mail" />
                <Input
                    name="password"
                    icon={FiLock}
                    type="password"
                    placeholder="Password"
                />
                <Button type="submit">Login</Button>
                <a href="forgotLink">Forgot password</a>
            </form>

            <a href="loginLink">
                <FiLogIn />
                Sign Up
            </a>
        </Content>
        <Background />
    </Container>
);

export default SignIn;
