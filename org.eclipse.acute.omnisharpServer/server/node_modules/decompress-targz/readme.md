# decompress-targz [![Build Status](https://travis-ci.org/kevva/decompress-targz.svg?branch=master)](https://travis-ci.org/kevva/decompress-targz)

> tar.gz decompress plugin


## Install

```
$ npm install --save decompress-targz
```


## Usage

```js
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');

decompress('unicorn.tar.gz', 'dist', {
	plugins: [
		decompressTargz()
	]
}).then(() => {
	console.log('Files decompressed');
});
```


## API

### decompressTargz()(buf)

#### buf

Type: `Buffer`

Buffer to decompress.


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
