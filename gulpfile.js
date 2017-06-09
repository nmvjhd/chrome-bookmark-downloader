/**
 * Created by matengfei on 2017/6/8.
 */
let gulp = require('gulp');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let doSomething = require('./gulp-doSomething');

gulp.task('css',function () {
    return gulp.src('./style.css')
        .pipe(postcss([autoprefixer]))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js',function () {
   return gulp.src('./js/**.js')
       .pipe(doSomething())
       .pipe(gulp.dest('./dist'));
});

gulp.task('bookmark',function () {
    return gulp.src('./bookmarks_2017_6_9.html')
        .pipe(doSomething())
        .pipe(gulp.dest('./dist'));
});

gulp.task('default',['bookmark']);