import styled from 'styled-components';

export const Container = styled.div`
    background: #232129;
    border-radius: 10px;
    border: 2px solid #232129;

    padding: 16px;
    width: 95%;

    color: #666360;

    display: flex;
    align-items: center;

    svg {
        margin-right: 16px;
    }

    input {
        background: transparent;
        flex: 1;
        border: 0;
        color: #f4ede8;

        &::placeholder {
            color: #666360;
        }
    }

    & + div {
        margin-top: 8px;
    }
`;
