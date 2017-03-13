/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

import * as cp from 'child_process';
import { existsSync } from 'fs';
import { extname } from 'path';
const win32 = 'win32' === process.platform;

export const spawn: typeof cp.spawn = (cmd: any, args: any, opts: any) => {
    if (win32) {
        // If we couldn't find the file, likely we'll end up failing,
        // but for things like "del", cmd will do the trick.
        if (extname(cmd).toLowerCase() !== '.exe' && cmd.indexOf(' ') !== -1) {
            // We need to use /s to ensure that spaces are parsed properly with cmd spawned content
            args = [['/s', '/c', `"${[cmd].concat(args).map(a => {
                if (/^[^"].* .*[^"]/.test(a)) {
                    return `"${a}"`;
                }
                return a;
            }).join(' ')}"`].join(' ')];
            cmd = 'cmd';
        } else if (!existsSync(cmd)) { // 'echo', 'dir', 'del', etc
            // We need to use /s to ensure that spaces are parsed properly with cmd spawned content
            args = ['/s', '/c', cmd].concat(args);
            cmd = 'cmd';
        } else if (extname(cmd) !== '.exe') { // *.js, *.bat, etc
            args = ['/c', cmd].concat(args);
            cmd = 'cmd';
        }
    }

    return cp.spawn(cmd, args, opts);
};
