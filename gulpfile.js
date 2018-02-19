'use strict';

// Creates variables for all the various gulp plugins
const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
      maps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
       del = require('del'),
       runSequence = require('run-sequence'),
       browserSync = require('browser-sync').create();

gulp.task("scripts", function() {
  console.log('doing javascriptin');
  gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'
  ])
  .pipe(maps.init())
  .pipe(concat('all.js'))                    //compiles js in one file
  .pipe(uglify())                            //minifies js
  .pipe(rename('all.min.js'))                //renames file
  .pipe(maps.write('./'))                    //writes map
  .pipe(gulp.dest('dist/scripts'))           //moves to dist/
});

gulp.task("styles", function() {
  gulp.src('sass/global.scss')
  .pipe(maps.init())                         //creates a source map
  .pipe(sass())                              //compiles scss to css
  .pipe(cleanCSS({compatibility: 'ie8'}))    //minifies css
  .pipe(rename('global.min.css'))            //renames file
  .pipe(maps.write('./'))                    //writes the map file
  .pipe(gulp.dest('dist/styles'))            //moves map and compiled files to dist/
  .pipe(browserSync.reload({                 //sets up browser reloading
      stream: true
    }))
});

gulp.task("images", function() {
  gulp.src('images/*')
       .pipe(imagemin())                     //optimizes file size
       .pipe(gulp.dest('dist/content'));     //moves images to dist/content folder
});

gulp.task("moveIndex", function() {
  gulp.src([
    'index.html',
  ])
  .pipe(gulp.dest('dist/'))
});

gulp.task("moveIcons", function() {
  gulp.src([
    'icons/*'], {
        base: './'
  }).pipe(gulp.dest('dist/'))
});

gulp.task("clean", function() {
  // deletes all folders in dist
  return del(['dist/**']);
});

gulp.task("build", function(callback) {
  console.log('Building the application.');
  runSequence("clean",
              ["scripts","styles","images","moveIndex","moveIcons"],
              "watch",
              callback);
});


gulp.task("default", ["build"], function() {
  console.log('Application has been built.');
});

// project reloads
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
  })
})

// continuously watch for scss changes
// when there is a change, run gulp styles
gulp.task('watch', ['browserSync', 'styles'], function (){
  gulp.watch('sass/**.scss', ['styles']);
})
