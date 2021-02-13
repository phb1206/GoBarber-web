import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
    const errors: Errors = {};

    err.inner.forEach(error => {
        if (error.path) {
            errors[error.path] = error.message;
        }
    });

    return errors;
}
