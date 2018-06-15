'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var file = (0, _path.join)(process.cwd(), 'config', 'plugin.js');
var pluginConf = require(file).default || [];

var PluginLoader = function () {
  function PluginLoader() {
    _classCallCheck(this, PluginLoader);
  }
  /**
   * get plugin instance by param name
   * @param {*} name 
   */


  _createClass(PluginLoader, null, [{
    key: 'get',
    value: function get(name) {
      var pluginInstance = null;
      var path = '';
      if (!name) {
        return this.cache.values(); // when param name is undefined , return the all instance of the cached plugin 
      }
      if (this.cache.has(name)) {
        console.log('get plugin instance from cache ');
        return this.cache.get(name); // get plugin instance from cache
      }
      if (!pluginConf.length) {
        console.log('no plugins needs to be loaded');
        return;
      }
      var config = pluginConf.filter(function (conf) {
        return conf.name === name;
      })[0];
      if (!config) {
        // check in the validity of plugin config
        console.log('not find the config of plugin ' + name + ' in config file ');
        return;
      }
      if (!config.package && !config.path) {
        console.log('not find the module ' + name);
        return;
      }
      path = config.package || (0, _path.join)(process.cwd(), config.path);
      var pluginClass = require(path).default;
      try {
        console.log('get plugin instance by new ');

        for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          arg[_key - 1] = arguments[_key];
        }

        if (!!arg.length) {
          pluginInstance = new (Function.prototype.bind.apply(pluginClass, [null].concat(arg)))(); // use arguments to new the plugin instance
        } else {
          pluginInstance = new pluginClass(config.options); // use options to new the plugin instance
        }
        if (pluginInstance && !this.cache.has(name)) {
          this.cache.set(name, pluginInstance); // cache the plugin instance
        }
        return pluginInstance; // return instance
      } catch (err) {
        try {
          return pluginClass; // return class
        } catch (e) {
          throw e;
        }
      }
    }
  }]);

  return PluginLoader;
}();

PluginLoader.cache = new Map();
exports.default = PluginLoader;