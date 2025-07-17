//gulpfile.js
const gulp = require("gulp"),
  minifyCSS = require("gulp-clean-css"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  csass = require('gulp-sass')(require('sass'));

const sassFiles = "scss/*.scss",
  cssDest = "dist/css/";

//compile scss into css
async function style() {
  return gulp
    .src(sassFiles)
    .pipe(csass().on("error", csass.logError))
    .pipe(gulp.dest(cssDest));
}

//This is for the minify css
async function minifycss() {
  return gulp
    .src(["dist/css/style.css", "!dist/css/style.min.css"])
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssDest));
}

// This is for the minifyjs
async function minifyjs() {
  return gulp
    .src(["dist/js/custom.js", "!dist/js/custom.min.js"])
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
}

async function watch() {
  gulp.watch(["scss/**/*.scss"], style);
  gulp.watch(["dist/css/style.css"], minifycss);
  gulp.watch(["dist/js/**/*.js", "!dist/js/**/*.min.js"], minifyjs);
}

gulp.task("default", watch);

exports.style = style;
exports.minifycss = minifycss;
exports.minifyjs = minifyjs;
exports.watch = watch;
