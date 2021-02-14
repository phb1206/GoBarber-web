import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import bgImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: stretch;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    max-width: 700px;
`;

const appearFromLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
`;

const appearFromRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
`;

export const AnimationContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    animation: ${appearFromLeft} 1s;

    form {
        margin: 80px 0;
        width: 340px;
        text-align: center;

        display: flex;
        flex-direction: column;
        align-items: center;

        h1 {
            margin-bottom: 24px;
        }

        a {
            color: #f4ede8;
            display: inline-block;
            margin-top: 24px;
            text-decoration: none;

            transition: color 0.2s;
            &:hover {
                color: ${shade(0.2, '#f4ede8')};
            }
        }
    }

    > a {
        color: #ff9000;
        margin-top: 24px;
        text-decoration: none;

        display: flex;
        align-items: center;

        svg {
            margin-right: 16px;
        }

        transition: color 0.2s;
        &:hover {
            color: ${shade(0.2, '#f4ede8')};
        }
    }
`;

export const Background = styled.div`
    flex: 1;
    background: url(${bgImg}) no-repeat center;
    background-size: cover;
    animation: ${appearFromRight} 1s;
`;
