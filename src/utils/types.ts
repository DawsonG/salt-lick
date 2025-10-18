export const isNumber = (value: unknown): value is number | string => {
    if (typeof value === 'string') {
        // check if this is only digits
        return /^\d+\.\d+$|^\d+$/.test(value) ? true : false;
    }

    return typeof value === 'number';
};

export const isString = (value: unknown): value is string =>
    typeof value === 'string';