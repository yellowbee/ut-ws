const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const config = yaml.safeLoad(fs.readFileSync(path.resolve(process.env.CONFIG_PATH, './config.yaml')));

module.exports = config;
