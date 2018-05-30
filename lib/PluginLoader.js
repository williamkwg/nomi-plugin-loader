import { join } from 'path';
const file = join(process.cwd(), 'config', 'plugin.js');
const pluginConf = require(file).default || [];
export default class PluginLoader {
  static cache = new Map();
  constructor() {}
  /**
   * get plugin instance by param name
   * @param {*} name 
   */
  static get(name, ...arg) {
    let pluginInstance = null;
    let path = '';
    if (!name) {
      return this.cache.values(); // when param name is undefined , return the all instance of the cached plugin 
    }
    if (this.cache.has(name)) {
      console.log(`get plugin instance from cache `)
      return this.cache.get(name); // get plugin instance from cache
    }
    if (!pluginConf.length) {
      console.log(`no plugins needs to be loaded`);
      return;
    }
    const config = pluginConf.filter(conf => { return conf.name === name })[0];
    if (!config) { // check in the validity of plugin config
      console.log(`not find the config of plugin ${name} in config file `);
      return;
    }
    if (!config.package && !config.path) {
      console.log(`not find the module ${name}`);
      return;
    }
    path = config.package || join(process.cwd(), config.path);
    const pluginClass = require(path).default;
    try {
      console.log(`get plugin instance by new `);
      if (!!arg.length) {
        pluginInstance = new pluginClass(...arg); // use arguments to new the plugin instance
      } else {
        pluginInstance = new pluginClass(config.options); // use options to new the plugin instance
      }
      if (pluginInstance && !this.cache.has(name)) {
        this.cache.set(name, pluginInstance); // cache the plugin instance
      }
      return pluginInstance; // return instance
    } catch(err) {
      try {
        return pluginClass;  // return class
      } catch (e) {
        throw e;
      }
    }
  }
}