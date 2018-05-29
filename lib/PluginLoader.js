import { join } from 'path';
export default class PluginLoader {
  static cache = new Map();
  file = '';
  pluginConf = [];
  constructor(path) { 
    const file = path ? join(process.cwd(), path) : join(process.cwd(), 'config', 'plugin.js');
    try {
      this.pluginConf = require(file);
      this.file = file;
    } catch(err) {
      throw err;
    }
  }
  /**
   * get plugin instance by param name
   * @param {*} name 
   */
  static getPlugin(name) {
    let pluginInstance = null;
    let path = '';
    if (!name) {
      return this.cache.values(); // when param name is undefined , return the all instance of the cached plugin 
    }
    if (this.cache.has(name)) {
      return this.cache.get(name); // get plugin instance from cache
    }
    const config = this.pluginConf.filter(conf => { return conf.name === name })[0];
    if (!config) { // check in the validity of plugin config
      console.log(`not find the config of plugin ${name} in ${this.file} `);
      return;
    }
    if (!config.package && !config.path) {
      console.log(`not find the module ${name}`);
      return;
    }
    path = config.package || join(process.pwd(), config.path);
    try {
      pluginInstance = new require(path)(config.options);
      if (pluginInstance && !this.cache.has(name)) {
        this.cache.set(name, pluginInstance); // cache the plugin instance
      }
      return pluginInstance; // return instance
    } catch(err) {
      try {
        return require(path);  // return class
      } catch (e) {
        throw e;
      }
    }
  }
}