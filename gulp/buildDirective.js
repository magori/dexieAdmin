const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});
gulp.task('buildDir:min', () => {
    return gulp.src(['src/directive/**/*.js','!src/directive/**/*spec.js'])
        //.pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('dexieAdminAmd.min.js'))
        //.pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildDir:AMD', () => {
    return gulp.src(['src/directive/**/*.js','!src/directive/**/*spec.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('dexieAdminAMD.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildDir', () => {
    return gulp.src(['src/directive/**/*.js','!src/directive/**/*spec.js'])
        .pipe(concat('dexieAdminEs6.js'))
        .pipe(gulp.dest('dist'));
});
