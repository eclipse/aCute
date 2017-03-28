'use strict';
const zlib = require('zlib');
const decompressTar = require('decompress-tar');
const fileType = require('file-type');
const pify = require('pify');

module.exports = () => buf => {
	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError(`Expected a Buffer, got ${typeof buf}`));
	}

	if (!fileType(buf) || fileType(buf).ext !== 'gz') {
		return Promise.resolve([]);
	}

	return pify(zlib.unzip)(buf).then(decompressTar());
};
