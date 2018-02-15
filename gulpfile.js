'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
       del = require('del'),
browserSync = require('browser-sync').create();

gulp.task("scripts", ["clean"], function() {
  console.log('doing javascriptin');
  gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'
  ])
  .pipe(maps.init())
  .pipe(concat('all.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'))

  gulp.src("js/all.js")
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('dist/scripts'))
  //compile files
  //concatenate and minify into all.min.css into dist/scripts folder
});

// gulp.task("concatenate", ["clean"], function() {
//   gulp.src([
//     'js/global.js',
//     'js/circle/autogrow.js',
//     'js/circle/circle.js'
//   ])
//   // .pipe(maps.init())
//   .pipe(concat('all.js'))
//   // .pipe(maps.write('./'))
//   .pipe(gulp.dest('dist/scripts'))
// });

gulp.task("styles", ["clean"], function() {
  console.log('doing cssin');
  //compile files
  //concatenate and minify into all.min.css into dist/styles folder
  gulp.src('sass/global.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task("images", ["clean"], function() {
  gulp.src('images/*')
       .pipe(imagemin())
       .pipe(gulp.dest('dist/images'));
  console.log('images call');
  //optimizes file size
  //dist/content folder
});

gulp.task("clean", function() {
  // return del([
  //   'dist/*'
  // ]);
  console.log('deleted all old files sure ok');
  // deletes all folders in dist
});

gulp.task("build", ["scripts","styles","images","watch"], function() {
  console.log('Building the application.');
  return gulp.src("css/application.css",)
});


gulp.task("default", ["build"], function() {
  console.log('Application has been built.');

});

// project reloads
//??????
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})

// continuously watch for scss changes
// when there is a change, run gulp styles
gulp.task('watch', ['browserSync', 'styles'], function (){
  gulp.watch('sass/**.scss', ['styles']);
})
