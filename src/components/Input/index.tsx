import React, {
    InputHTMLAttributes,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './style';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    containerStyle?: React.CSSProperties;
    icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({
    name,
    containerStyle = {},
    icon: Icon,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        if (inputRef.current?.value) setIsFilled(true);
        else setIsFilled(false);
    }, []);

    const { fieldName, defaultValue, error, registerField } = useField(name);
    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value',
        });
    }, [fieldName, registerField]);

    return (
        <Container
            style={containerStyle}
            isFocused={isFocused}
            isFilled={isFilled}
            isErrored={!!error}
        >
            {Icon && <Icon size={20} />}
            <input
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                ref={inputRef}
                {...rest}
            />
            {error && (
                <Error title={error}>
                    <FiAlertCircle size={20} color="#c53030" />
                </Error>
            )}
        </Container>
    );
};

export default Input;
