[![Build status](https://img.shields.io/travis/redom/nodom/master?style=flat-square)](https://travis-ci.org/redom/nodom?branch=master)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
# NO:DOM
fake DOM for [RE:DOM](https://redom.js.org)

## installing
```
npm install nodom
```

## usage
```js
const { Document, SVGElement } = require('nodom');
global.document = new Document();
global.SVGElement = SVGElement;
const { el, mount } = require('redom');

mount(document.body, el('h1', 'Hello world!'));

console.log(document.body.outerHTML); // <body><h1>Hello world!</h1></body>
```
