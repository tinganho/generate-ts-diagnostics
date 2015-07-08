
/// <reference path='typings/node/node.d.ts'/>
/// <reference path='typings/through2/through2.d.ts'/>
/// <reference path='typings/gulp-util/gulp-util.d.ts'/>

import * as fs from 'fs';
import * as path from 'path';
import through = require('through2');
import * as gutil from 'gulp-util';

let PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-generate-ts-diagnostics';

interface MessageProperty {
    name: string;
    type: string;
    optional?: boolean;
}

export = function(props: MessageProperty[]) {
    if (!props || props.length === 0) {
        throw new PluginError(PLUGIN_NAME, 'Missing properties argument');
    }

    let diagnosticsText = `
export interface DiagnosticMessages {
    [diagnostic: string]: DiagnosticMessage;
}`;

    for (let prop of props) {
        // Don't treat message.
        if (prop.name === 'message') {
            continue;
        }
        diagnosticsText += 'export interface DiagnosticMessage {';
        diagnosticsText += '    message: string';
        diagnosticsText += `    ${prop.name}${prop.optional ? '?' : ''}:${prop.type}`;
        diagnosticsText += '}\n\n';
    }

    let stream = through.obj(function(file, encoding, next) {
        let json = JSON.parse(file.contents);
        let length = Object.keys(json).length;
        let index = 0;

        for (let message in json) {
            diagnosticsText += 'var diagnosticMessages: DiagnosticMessage = {'
            diagnosticsText += '    ' +
                message.replace(/\s+/g, '_')
                .replace(/['"\.,]/g, '')
                .replace(/{(\d)}/g, '$1');

            diagnosticsText += ': {\n';
            diagnosticsText += '        message: \'' + message + '\',\n';
            for (let prop of props) {
                diagnosticsText += `        ${prop.name}: ' + json[error]['${prop.name}'] + ',\n`;
            }
            diagnosticsText += '    }';
            if (index < length - 1) {
                diagnosticsText += ',\n';
            }
            index++;
        }
        diagnosticsText += '\n';
        diagnosticsText += '}\n\n';

        diagnosticsText += 'export default diagnosticMessages;\n';

        file.contents = Buffer.concat([new Buffer(diagnosticsText)]);

        this.push(file);

        next();
    });

    return stream;
}