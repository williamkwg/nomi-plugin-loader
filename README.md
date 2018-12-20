# nomi-plugin-loader

the plugin loader tool for loading the nomi plugins!

## Installation

``` bash
$ npm install nomi-plugin-loader --save
```

Node.js >= 8.0.0  required.

## API

- get

## Example

First of all, we need to edit the config file of plugins.

``` javascript

module.exports = [
  {
    "name": "redirectPlugin", // use get('pluginA') to get the instance of plugin => new PluginA(options)
    "package": "",
    "path": "plugins/RedirectPlugin.js",
    "options": {
      "a": "a",
      "b": "b"
    }
  },
  {
    "name": "cookie", // use .get('cookie', ctx, key) to get the instance of plugin => new Cookie(ctx, key)
    "package": "nomi-cookie",
    "path": "",
    "options": "nomi-cookie-key"
  }
];

 ```

then, we could call the get method to get the plugin instance.

#### demo1

``` javascript

const redirectPlugin = require('nomi-plugin-loader').get('redirectPlugin'); //获取某一个插件A的实例
redirectPlugin.redirect('/home');

```

#### demo2

``` javascript

const pluginLoader = require('nomi-plugin-loader');
class OrderController{

    @RequestMapping({path:"/home}",method:"get"})
    async index(req,res,paras,ctx) {
        const cookie = pluginLoader.get('cookie', ctx, 'nomi-key');
        cookie.set('userName', 'weiguo.kong');
        cookie.get('userName')); // weiguo.kong
    }
}

exports.OrderController = OrderController;
```
