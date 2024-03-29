var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var log = require('gulplog');
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var through = require('through');

var isDist = process.argv.indexOf('serve') === -1;

gulp.task('css-index', function () {
    return gulp.src('public/stylesheets/index-styles.css')
    .pipe(isDist ? csso() : through())
    .pipe(isDist ? autoprefixer('last 2 versions', { map: false }) : through())
    .pipe(rename('index-styles.min.css'))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('css-admin', function () {
    return gulp.src('public/stylesheets/admin-styles.css')
    .pipe(isDist ? csso() : through())
    .pipe(isDist ? autoprefixer('last 2 versions', { map: false }) : through())
    .pipe(rename('admin-styles.min.css'))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('js-index', function () {
    var b = browserify({
      entries: 'public/javascripts/index/index.js',
      debug: true
    });
  
    return b.bundle()
      .pipe(source('public/javascripts/index/index.js'))
      .pipe(buffer())
      .pipe(uglify())
        .on('error', log.error)
      .pipe(rename('build.js'))
      .pipe(gulp.dest('public/javascripts/index/'));
});

gulp.task('js-event', function () {
  var b = browserify({
    entries: 'public/javascripts/event/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('public/javascripts/event/index.js'))
    .pipe(buffer())
    .pipe(uglify())
      .on('error', log.error)
    .pipe(rename('build.js'))
    .pipe(gulp.dest('public/javascripts/event/'));
});


gulp.task('js-admin', function () {
    var b = browserify({
      entries: 'public/javascripts/admin/index.js',
      debug: true
    });
  
    return b.bundle()
      .pipe(source('public/javascripts/admin/index.js'))
      .pipe(buffer())
      .pipe(uglify())
        .on('error', log.error)
      .pipe(rename('build.js'))
      .pipe(gulp.dest('public/javascripts/admin/'));
});

gulp.task('css-index-watch', ['css-index'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('css-admin-watch', ['css-admin'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('js-index-watch', ['js-index'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('js-admin-dev', function () {
    var b = browserify({
      entries: 'public/javascripts/admin/index.js',
      debug: true
    });
  
    return b.bundle()
      .pipe(source('public/javascripts/admin/index.js'))
      .pipe(buffer())
        .on('error', log.error)
      .pipe(rename('build.js'))
      .pipe(gulp.dest('public/javascripts/admin/'));
});
gulp.task('js-admin-watch', ['js-admin-dev'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('js-event-watch', ['js-event'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('js', ['js-admin', 'js-index', 'js-event']);
gulp.task('css', ['css-index', 'css-admin']);

gulp.task('default', ['js', 'css']);



gulp.task('serve', function () {

    browserSync.init({
        proxy: 'http://localhost:' + require('env-port')('8001')
    });

    gulp.watch('public/views/*.html', ['reload']);
    gulp.watch('views/*.ejs', ['reload']);

    gulp.watch('public/stylesheets/admin-styles.css', ['css-admin-watch']);
    gulp.watch('public/stylesheets/index-styles.css', ['css-index-watch']);
    gulp.watch(['public/javascripts/index/**/**.js', '!public/javascripts/index/build.js'], ['js-index-watch']);
    gulp.watch(['public/javascripts/admin/**/**.js', '!public/javascripts/admin/build.js'], ['js-admin-watch']);
    gulp.watch(['public/javascripts/event/**/**.js', '!public/javascripts/event/build.js'], ['js-event-watch']);
});

