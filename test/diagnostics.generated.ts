
export interface DiagnosticMessage {
    message: string;
    status: number;
    code: number;
}

export var Diagnostics = {
    Request_successful: {
        message: 'Request successful.',
        status:  200,
        code:  1000,
    },
    Missing_argument_0: {
        message: 'Missing argument {0}.',
        status:  400,
        code:  2000,
    },
    Missing_arguments_0_and_1: {
        message: 'Missing arguments {0} and {1}.',
        status:  400,
        code:  2001,
    },
    Could_not_find_any_user_with_the_username_email_and_password_combination: {
        message: 'Could not find any user with the username, email and password combination.',
        status:  400,
        code:  2002,
    },
    Internal_server_error: {
        message: 'Internal server error.',
        status:  500,
        code:  3000,
    },
}

export default Diagnostics;
