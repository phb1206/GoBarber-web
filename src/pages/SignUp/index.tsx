import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import { Container, Content, Background } from './style';

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback(async (data: unknown) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Name required'),
                email: Yup.string()
                    .required('E-mail required')
                    .email('Insert valid e-mail'),
                password: Yup.string().min(
                    6,
                    'Password must be at least 6 characters',
                ),
            });
            await schema.validate(data, {
                abortEarly: false,
            });
        } catch (err) {
            const errors = getValidationErrors(err);
            formRef.current?.setErrors(errors);
        }
    }, []);

    return (
        <Container>
            <Background />
            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Login with e-mail</h1>
                    <Input name="name" icon={FiUser} placeholder="Name" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Password"
                    />
                    <Button type="submit">Sign Up</Button>
                </Form>

                <a href="loginLink">
                    <FiArrowLeft />
                    Login
                </a>
            </Content>
        </Container>
    );
};

export default SignUp;
