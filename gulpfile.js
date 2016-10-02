var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  changed = require('gulp-changed'),
  rev = require('gulp-rev'),
  browserSync = require('browser-sync'),
  ngannotate = require('gulp-ng-annotate'),
  del = require('del');


gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
/*
css:[minifycss(),rev()],
js: [ngannotate(),uglify(),rev()]
*/

gulp.task('usemin',['jshint'], function () {
  return gulp.src('./app/**/*.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()]
      }))
      .pipe(gulp.dest('server/public/'));
});


// Images
gulp.task('imagemin', function() {
  return del(['server/public/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('server/public/images'))
    .pipe(notify({
      message: 'Images task complete'
    }));

});

gulp.task('copyfonts', ['clean'], function() {
  gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./server/public/fonts'));
  gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./server/public/fonts'));
  gulp.src('./bower_components/mdbootstrap/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./server/public/fonts/'));
  gulp.src('./bower_components/mdbootstrap/images/lightbox/*')
    .pipe(gulp.dest('./server/public/images/lightbox'));
  gulp.src('./bower_components/mdbootstrap/images/overlays/*')
    .pipe(gulp.dest('./server/public/images/overlays'));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
  // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function() {
  var files = [
    'app/**/*.html',
    'app/styles/**/*.css',
    'app/images/**/*.png',
    'app/scripts/**/*.js',
    'server/public/**/*'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "./server/public",
      index: "index.html"
    }
  });
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});

gulp.task('browser-sync2', function() {
  var files = [
    'app/**/*.html',
    'app/styles/**/*.css',
    'app/images/**/*.png',
    'app/scripts/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "app",
      index: "index.html"
    }
  });
});

// Clean
gulp.task('clean', function() {
  return del(['server/public']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('usemin', 'imagemin', 'copyfonts');
});
