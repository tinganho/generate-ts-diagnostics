
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
}\n\n`;

    diagnosticsText += 'export interface DiagnosticMessage {';
    diagnosticsText += '    message: string;\n';
    for (let i in props) {
        // Don't treat message.
        if (props[i].name === 'message') {
            props.splice(i, 1);
            continue;
        }
        diagnosticsText += `    ${props[i].name}${props[i].optional ? '?' : ''}:${props[i].type};\n`;
    }
    diagnosticsText += '}\n\n';

    let stream = through.obj(function(file, encoding, next) {
        let json = JSON.parse(file.contents);
        let length = Object.keys(json).length;
        let index = 0;

        diagnosticsText += 'var diagnosticMessages: DiagnosticMessages = {\n';
        for (let message in json) {
            diagnosticsText += '    ' +
                message.replace(/\s+/g, '_')
                    .replace(/['"\.,]/g, '')
                    .replace(/{(\d)}/g, '$1');

            diagnosticsText += ': {\n';
            diagnosticsText += '        message: \'' + message + '\',\n';
            for (let prop of props) {
                diagnosticsText += `        ${prop.name}:  ${json[message][prop.name]},\n`;
            }
            diagnosticsText += '    },\n';
            index++;
        }
        diagnosticsText += '}\n\n';

        diagnosticsText += 'export default diagnosticMessages;\n';

        file.contents = Buffer.concat([new Buffer(diagnosticsText)]);

        this.push(file);

        next();
    });

    return stream;
}