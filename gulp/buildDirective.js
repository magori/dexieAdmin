const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const embedTemplates = require('gulp-angular-embed-templates');

const ngAnnotate = require('gulp-ng-annotate');

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del','gulp-rename']
});

gulp.task('clean-dist', function(){
  return $.del(['dist']);
});

gulp.task('es6-commonjs',['clean-dist'], function(){

  var directiveFilter = $.filter('**/*.directive.js', { restore: true });

  return gulp.src(['src/directive/**/*.js','!src/directive/**/*spec.js'])
        .pipe(directiveFilter)
        .pipe(embedTemplates())
        .pipe(directiveFilter.restore)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist/es6'));
});

gulp.task('commonjs-bundle',['es6-commonjs'], function(){
  return browserify(['dist/es6/index.module.js']).bundle()
    .pipe(source('dexieAdminAmd.min.js'))
    .pipe(buffer())
    //.pipe($.uglify())
    //.pipe($.rename('dexieAdminAmd.min.js'))
    .pipe(gulp.dest("dist"));
});

gulp.task('buildD', ['commonjs-bundle'], function() {
    gulp.src('src/directive/**/*.html').pipe(gulp.dest('dist'));

    gulp.src('dist/dexieAdminAmd.min.js').pipe(gulp.dest('.tmp/serve'));
});
