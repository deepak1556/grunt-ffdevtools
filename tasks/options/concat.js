module.exports = {
    concat: {
      options: {
        separator: ';'
      },
      src: [
          'src/js/vendor/*.js',
          'src/tmp/templates.js'
      ],
      dest: 'ff_extension/data/panes/js/concat.js'
    }
};
