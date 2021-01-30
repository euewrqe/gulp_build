var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var livereload  = require('gulp-livereload');
var connect     = require('gulp-connect');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

var coffeeify = require('coffeeify');  // coffee
var tsify = require('tsify');  // type

var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');

var fs = require('fs');
var fileinclude = require('gulp-file-include');

var ejs = require('gulp-ejs');  // ejs

var jade = require("gulp-jade");

var srcPath = "./src";
var distPath = "./template";

// render js
gulp.task("js", function (done) {
    var jsPath = {
        src: path.join(srcPath, "js/entry.js"),
        dist: path.join(distPath, "assets/js")
    }
    browserify(jsPath.src)
        .transform(babelify)
        .bundle()
        .pipe(source("entry.js"))
        .pipe(gulp.dest(jsPath.dist))
        .pipe(livereload());
    done();
})

// render typescript
gulp.task("ts", function (done) {
    var jsPath = {
        src: path.join(srcPath, "ts/entry.ts"),
        dist: path.join(distPath, "assets/js")
    }
    browserify(jsPath.src)
        .plugin(tsify)
        .bundle()
        .pipe(source("entry_ts.js"))
        .pipe(gulp.dest(jsPath.dist))
        .pipe(livereload());
    done();
})

// render coffeescript
gulp.task("coffee", function (done) {
    var jsPath = {
        src: path.join(srcPath, "coffee/entry.coffee"),
        dist: path.join(distPath, "assets/js")
    }
    browserify(jsPath.src)
        .transform(coffeeify)
        .bundle()
        .pipe(source("entry_coffee.js"))
        .pipe(gulp.dest(jsPath.dist))
        .pipe(livereload());
    done();
})

// render scss
gulp.task("scss", function (done) {
    var cssPath = {
        src: path.join(srcPath, "scss/entry.scss"),
        dist: path.join(distPath, "assets/css")
    }
    return gulp.src([
        cssPath.src
    ])
    .pipe(sass())
    .pipe(concat("entry.css"))
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssPath.dist))
    .pipe(livereload());
})

// render sass
gulp.task("sass", function (done) {
    var cssPath = {
        src: path.join(srcPath, "sass/*.sass"),
        dist: path.join(distPath, "assets/css")
    }
    return gulp.src([
        cssPath.src
    ])
    .pipe(sass())
    .pipe(concat("entry.css"))
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssPath.dist))
    .pipe(livereload());
})

// render html fileinclude
gulp.task("fileinclude", function (done) {
    var htmlPath = {
        src: "./src/html/*.html",
        dist: distPath
    }

    return gulp.src([
        htmlPath.src
    ])
    .pipe(fileinclude({
        prefix: "@@", 
        basepath: "@file",
        rootpath: "./", 
        context: {
            theme: "default"
        }
    }))
    .pipe(gulp.dest(htmlPath.dist))
    .pipe(livereload());
})

// render ejs
gulp.task("ejs", function (done) {
    return gulp.src("./src/httemplate/ejs/*.ejs")
        .pipe(ejs())
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest(distPath))
        .pipe(livereload());
})

// render jade
gulp.task("jade", function (done) {
    return gulp.src([
        "./src/data/index.jade"
    ])
    .pipe(jade())
    .pipe(gulp.dest(distPath))
    .pipe(livereload());
})

// watch
gulp.task("watch", function (done){
    gulp.watch("./src/data/**.jade", gulp.series(gulp.parallel(["jade"])));
})

// server
gulp.task("server", function (done) {
    connect.server({
        name: "admin",
        root: [distPath],
        port: 8000,
        livereload: true,
        fallback: "index.html"
    })
})

// Entry
gulp.task("start", gulp.series(gulp.parallel(["js", "server"])))