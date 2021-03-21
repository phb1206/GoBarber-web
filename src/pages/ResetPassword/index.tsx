import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useLocation } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './style';
import api from '../../services/api';

interface ResetPasswordDTO {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const location = useLocation();

    const handleSubmit = useCallback(
        async (data: ResetPasswordDTO) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    password: Yup.string().required('Insert password'),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref('password'), null],
                        "Confirmation doesn't match",
                    ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const token = location.search.replace('?token=', '');

                if (!token) throw new Error();

                await api.patch('/password/reset', {
                    token,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                });

                addToast({
                    type: 'success',
                    title: 'Password changed',
                    description:
                        'Please, try to log in using your new password',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    // return;
                }

                addToast({
                    type: 'error',
                    title: 'Change password error',
                    description:
                        'An error has ocurred when trying to change your password, please try again',
                });
            }
        },
        [addToast, location],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Change password</h1>
                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="New password"
                        />
                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="New password confirmation"
                        />
                        <Button type="submit">Change password</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ResetPassword;
