/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
    // gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon');

gulp.task('default', ['server']);

gulp.task('server', function() {
    nodemon({
        'script': 'index.js'
            // 'ignore': 'public/js/*.js'
    });
});
