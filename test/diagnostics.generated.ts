
export interface DiagnosticMessage {
    message: string;
    status: number;
    code: number;
}

export var Diagnostics = {
    Arguments_0: {
        message: 'Arguments \'{0}\'.',
        status:  undefined,
        code:  1000,
    },
    Quotes_0_1: {
        message: 'Quotes \'{0}\' "{1}".',
        status:  undefined,
        code:  1000,
    },
    Special_characters__plus__C: {
        message: 'Special characters ( + - C).',
        status:  undefined,
        code:  1001,
    },
}

export default Diagnostics;
