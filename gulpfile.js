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
  return gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'
  ])
  .pipe(maps.init())
  .pipe(concat('all.js'))                    // compiles js in one file
  .pipe(uglify())                            // minifies js
  .pipe(rename('all.min.js'))                // renames file
  .pipe(maps.write('./'))                    // writes map
  .pipe(gulp.dest('dist/scripts'))           // moves to dist/
});

gulp.task("styles", function() {
  return gulp.src('sass/global.scss')
  .pipe(maps.init())                         // creates a source map
  .pipe(sass())                              // compiles scss to css
  .pipe(cleanCSS({compatibility: 'ie8'}))    // minifies css
  .pipe(rename('global.min.css'))            // renames file
  .pipe(maps.write('./'))                    // writes the map file
  .pipe(gulp.dest('dist/styles'))            // moves map and compiled files to dist/
  .pipe(browserSync.reload({                 // sets up browser reloading
      stream: true
    }))
});

gulp.task("images", function() {
  return gulp.src('images/*')
       .pipe(imagemin())                     //optimizes file size
       .pipe(gulp.dest('dist/content'));     //moves images to dist/content folder
});

gulp.task("moveIndex", function() {
  return gulp.src([
    'index.html',                            //  moves index to dist/
  ])
  .pipe(gulp.dest('dist/'))
});

gulp.task("moveIcons", function() {
  return gulp.src([
    'icons/*'], {                            //  moves icons to dist/
        base: './'
  }).pipe(gulp.dest('dist/'))
});

gulp.task("clean", function() {
  return del(['dist/**']);                   // deletes all folders in dist
});

gulp.task("build", function() {              // runs tasks in sequence
  runSequence("clean",
              ["scripts","styles","moveIndex","moveIcons","images"],
              "watch");
});

gulp.task("default", ["build"], function() {
});

gulp.task('browserSync', function() {
  browserSync.init({                        //  creates server that watches for changes
    server: {
      baseDir: './dist/'
    },
  })
})

// Continuously watch for scss changes
// When there is a change, run gulp styles
gulp.task('watch', ['browserSync', 'styles'], function (){
  gulp.watch('sass/**.scss', ['styles']);
})
