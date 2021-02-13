import React, { useRef, useCallback, useContext } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/AuthContext';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import { Container, Content, Background } from './style';

interface SignInDTO {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { user, signIn, signOut } = useAuth();

    const handleSubmit = useCallback(
        async (data: SignInDTO) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Insert valid e-mail')
                        .email('Insert valid e-mail'),
                    password: Yup.string().required('Insert password'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                signIn(data);
            } catch (err) {
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);
            }
        },
        [signIn],
    );

    return (
        <Container>
            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
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
                </Form>

                <a href="loginLink">
                    <FiLogIn />
                    Sign Up
                </a>
            </Content>
            <Background />
        </Container>
    );
};

export default SignIn;
