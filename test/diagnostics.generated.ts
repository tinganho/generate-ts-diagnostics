
export interface DiagnosticMessage {
    message: string;
    code: number;
    category: string;
}

export var Diagnostics = {
    Arguments_0: {
        message: 'Arguments \'{0}\'.',
        code: '1000',
        category: 'error',
    },
    Quotes_0_1: {
        message: 'Quotes \'{0}\' "{1}".',
        code: '1000',
        category: 'error',
    },
    Special_characters__plus__C: {
        message: 'Special characters ( + - C).',
        code: '1001',
        category: 'error',
    },
}

export default Diagnostics;
