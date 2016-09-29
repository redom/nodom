# NO:DOM
fake DOM for [RE:DOM](https://redom.js.org)

## installing
```
npm install nodom
```

## usage
```js
const { Document, render } = require('nodom')
const document = new Document()
const { el, mount } = require('redom')

mount(document.body, el('h1', 'Hello world!'))

console.log(render(document.body)) // <body><h1>Hello world!</h1></body>
```
