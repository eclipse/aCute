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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var win32 = 'win32' === process.platform;
exports.spawn = function (cmd, args, opts) {
    if (win32) {
        // If we couldn't find the file, likely we'll end up failing,
        // but for things like "del", cmd will do the trick.
        if (path_1.extname(cmd).toLowerCase() !== '.exe' && cmd.indexOf(' ') !== -1) {
            // We need to use /s to ensure that spaces are parsed properly with cmd spawned content
            args = [['/s', '/c', "\"" + [cmd].concat(args).map(function (a) {
                        if (/^[^"].* .*[^"]/.test(a)) {
                            return "\"" + a + "\"";
                        }
                        return a;
                    }).join(' ') + "\""].join(' ')];
            cmd = 'cmd';
        }
        else if (!fs_1.existsSync(cmd)) {
            // We need to use /s to ensure that spaces are parsed properly with cmd spawned content
            args = ['/s', '/c', cmd].concat(args);
            cmd = 'cmd';
        }
        else if (path_1.extname(cmd) !== '.exe') {
            args = ['/c', cmd].concat(args);
            cmd = 'cmd';
        }
    }
    return cp.spawn(cmd, args, opts);
};
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/windows/super-spawn.js.map