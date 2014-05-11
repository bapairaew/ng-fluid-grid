module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    uglify: {
      dist: {
        src: 'ng-fluid-grid.js',
        dest: 'ng-fluid-grid.min.js'
      }
    }
  });

  grunt.registerTask('default', ['uglify']);
};