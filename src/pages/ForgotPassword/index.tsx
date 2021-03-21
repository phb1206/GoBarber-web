import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './style';
import api from '../../services/api';

interface ForgotPasswordDTO {
    email: string;
    password: string;
}

const ForgotPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();

    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
        async (data: ForgotPasswordDTO) => {
            setLoading(true);
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Insert valid e-mail')
                        .email('Insert valid e-mail'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/password/forgot', {
                    email: data.email,
                });

                addToast({
                    type: 'success',
                    title: 'Password recover email sent',
                    description: 'Chenck your inbox for further instructions',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    // return;
                }

                addToast({
                    type: 'error',
                    title: 'Password recover error',
                    description:
                        'An error has ocurred while trying to recover your password, please try again',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recover password</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Button loading={loading} type="submit">
                            Recover
                        </Button>
                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Back to login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ForgotPassword;
