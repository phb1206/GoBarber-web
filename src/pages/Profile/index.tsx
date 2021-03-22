import React, { useRef, useCallback, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import { AvatarInput, Container, Content } from './style';
import api from '../../services/api';

interface ProfileDTO {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: ProfileDTO) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Name required'),
                    email: Yup.string()
                        .required('Insert valid e-mail')
                        .email('Insert valid e-mail'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: (val: string) => !!val.length,
                        then: Yup.string()
                            .required()
                            .min(6, 'At least 6 characters'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: (val: string) => !!val.length,
                            then: Yup.string()
                                .required()
                                .min(6, 'At least 6 characters'),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), null],
                            "Passwords don't match",
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const formData = {
                    name: data.name,
                    email: data.email,
                    ...(data.old_password
                        ? {
                              old_password: data.old_password,
                              password: data.password,
                              password_confirmation: data.password_confirmation,
                          }
                        : {}),
                };

                const response = await api.put('/profile', formData);

                updateUser(response.data);

                addToast({
                    type: 'success',
                    title: 'Profile updated',
                    description: 'Your crendentials have been updated',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    // return;
                }

                addToast({
                    type: 'error',
                    title: 'Profile update error',
                    description:
                        'Something went wrong when trying to update your profile credentials, please try again',
                });
            }
        },
        [addToast, updateUser],
    );

    const handleAvatarChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            try {
                if (event.target.files) {
                    const data = new FormData();
                    data.append('avatar', event.target.files[0]);

                    api.patch('/users/avatar', data).then(res => {
                        updateUser(res.data);
                        addToast({
                            type: 'success',
                            title: 'Avatar updated',
                        });
                    });
                }
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    // return;
                }

                addToast({
                    type: 'error',
                    title: 'Authentication error',
                    description:
                        'A login error has ocurred, please check credentials',
                });
            }
        },
        [addToast, updateUser],
    );

    return (
        <Container>
            <header>
                <Link to="/dashboard">
                    <FiArrowLeft />
                </Link>
            </header>
            <Content>
                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialData={{
                        name: user.name,
                        email: user.email,
                    }}
                >
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input
                                type="file"
                                id="avatar"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </AvatarInput>

                    <h1>My Profile</h1>

                    <Input name="name" icon={FiUser} placeholder="Name" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />

                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="old_password"
                        icon={FiLock}
                        type="password"
                        placeholder="Current password"
                    />
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
                        placeholder="Repeat password"
                    />
                    <Button type="submit">Submit changes</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
