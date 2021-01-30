## development commands
```
npm init
npm install gulp -g
npm install gulp --save-dev
```

composition:
any source file are saving in `src` path, to be divided `html`, `js` and `scss` assets
output path is `templates`
```
src
    html
    js
    scss
templates(output)
```

task list:
- js
- css
- fileinclude
- coffee
- ts
- img
- watch
- server
- start(is entry)

dependents(use `--save`):
- bootstrap
- jquery

`bootstrap` and `jquery` file as a dependents cs and js file imports to the project
```
bootstrap.min.css: node_modules/bootstrap/dist/css/bootstrap.min.css
bootstrap.min.js: node_modules/bootstrap/dist/js/bootstrap.min.js
jquery: node_modules/jquery/dist/jquery.min.js
```

### serve & watch
```
npm install gulp-livereload gulp-connect --save-dev

var livereload  = require('gulp-livereload');
var connect     = require('gulp-connect');

// .pipe(livereload())
gulp.task("server", function (done) {
    connect.server({
        name: "admin",
        root: [distPath],
        port: 8000,
        livereload: true,
        fallback: "index.html"
    })
})

// watch file
gulp.task("watch", function (done){
    gulp.watch("./src/data/**.jade", gulp.series(gulp.parallel(["jade"])));
})
```


### resolve es6

.babelrc ->
```
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

```
npm install --save-dev @babel/core @babel/preset-env
npm install --save-dev babelify browserify 
npm install --save-dev vinyl-source-stream
// gulpfile.js
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('js', (done) => {
    var jspaths = {
        'jsDist': distPath + '/assets/js',
        'jsEntry': './src/js/entry.js'
    }
    
    browserify(jspaths.jsEntry, { debug: true })
      .transform(babelify)
      .bundle()
      .pipe(source('entry.js'))
      .pipe(gulp.dest(jspaths.jsDist))
    done();
});
```
 




### coffeescript
coffeeify 

```
npm install coffeescript coffeeify --save-dev

// gulpfile.js
var coffeeify = require('coffeeify');

gulp.task('coffee', (done) => {
    var jspaths = {
        'jsDist': distPath + '/assets/js',
        'jsEntry': './src/coffees/entry.coffee'
    }
    
    browserify(jspaths.jsEntry, { debug: true })
        .transform(coffeeify)
        .bundle()  // uglify
        .pipe(source('entry.js'))
        .pipe(gulp.dest(jspaths.jsDist))
    done();
});
```

### typescript
tsify
```
npm install typescript tsify --save-dev

// gulpfile.js
var tsify = require('tsify');
gulp.task('ts', (done) => {
    var jspaths = {
        'jsDist': distPath + '/assets/js',
        'jsEntry': './src/ts/entry.ts'
    }

    
    browserify(jspaths.jsEntry, { debug: true })
        .plugin(tsify)
        .bundle()
        .pipe(source('entry.js'))
        .pipe(gulp.dest(jspaths.jsDist))
    done();
});

```

### scss
```
npm install gulp-sass --save-dev

// gulpfile.js
var sass = require('gulp-sass');
return gulp.src([
        "./src/scss/entry.scss"
    ]).pipe(sass())

// === combine multiple css
npm install gulp-concat --save-dev

// gulpfile.js
return gulp.src([
        "./src/scss/entry.css",
        "*.css"
    ]).pipe(concat())

// === minify css
npm install gulp-clean-css --save-dev

// gulpfile.js
return gulp.src([
        "./src/scss/entry.css",
    ]).pipe(minifyCSS())
```


### html fileinclude

```
npm install gulp-file-include --save-dev

// gulpfile.js
var fileinclude = require('gulp-file-include');

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
```
grammar:
```
<!--index include title.html-->
@@include("./partial/title.html", {"title": "Dashboard"})
<!--title.html-->
<title>admin|@@title</title>
```

### html jade

```
npm install gulp-jade --save-dev

// gulpfile.js
var jade = require("gulp-jade");
gulp.task("jade", function (done) {
    var htmlPath = {
        src: "./src/html/*.html",
        dist: distPath
    }
    return gulp.src([
        "./src/data/index.jade"
    ])
    .pipe(jade())
    .pipe(gulp.dest(htmlPath.dist))
    .pipe(livereload());
})
```

