module.exports = function(grunt) {

  function loadFrom(path, config) {
    var glob = require('glob'),
    object = {};

    glob.sync('*', {cwd: path}).forEach(function(option) {
      var key = option.replace(/\.js$/,'');
      config[key] = require(path + option);
    });
  }

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    clean: ['tmp']
  };

  loadFrom('./tasks/options/', config);

  grunt.initConfig(config);

  require('matchdep')
  .filterDev('grunt-*')
  .filter(function(name){ return name !== 'grunt-cli'; })
  .forEach(grunt.loadNpmTasks);

  grunt.loadTasks('tasks');

  grunt.registerTask('build', [
    'jst',
    'concat'
  ]);  

  grunt.registerTask('build_xpi', [
    'mozilla-addon-sdk',
    'mozilla-cfx-xpi'
  ]);

  grunt.registerTask('default', ['build', 'build_xpi']);

};
