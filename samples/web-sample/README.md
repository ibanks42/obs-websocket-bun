Simple example to show connecting and making a scene switcher.

![web-sample.png](../../.github/images/web-sample.png)

```sh
npm init
npm install obs-websocket-bun --save
```

or...

```sh
bower init
bower install obs-websocket-bun
```

Then include `obs-websocket.js` in your HTML file.

```html
<script type="text/javascript" src="node_modules/obs-websocket-bun/dist/obs-websocket.js"></script>
```

and start using it.

```js
<script>
  const obs = new OBSWebSocket();
</script>
```
