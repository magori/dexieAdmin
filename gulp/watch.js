'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

var _event;
gulp.task('buildDireciveAndCopy', ['build'], function() {
    console.log("build directive");
     gulp.src('dist/dexieAdmin.js').pipe(gulp.dest('.tmp/serve'));
     if(_event){
       browserSync.reload(_event.path);
     }
});

gulp.task('watch', ['scripts:watch', 'inject','buildDireciveAndCopy'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), function(event) {
    if(isOnlyChange(event)) {
      browserSync.reload(event.path);
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });

  gulp.watch(path.join(conf.paths.src, '/directive/**/*.*'),['buildDireciveAndCopy']).on('change',function (event){
    _event = event;
  });
});
