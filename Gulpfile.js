const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const njr = require('gulp-nunjucks-render');
const data = require('gulp-data');

 function nunjucks(){
    // where the nunjucks files to convert to html are 
    return gulp.src('./app/pages/**/*.+(html|njk)')
    // include the data included in data.json
    .pipe(data(function(){
        return require('./app/data.json')
    }))
    // actually do the conversion
    .pipe(njr({
        // where the template files are located
        path: ['app/templates']
    }))
    // where to send the converted njk files => html files
    .pipe(gulp.dest('./docs/'))
}

function style() {
    // 1. where is my scss file?
    return gulp.src('app/scss/**/*.scss')
    // 2. pass that file through sass compiler (to change to minified change outputStyle to compressed)
    .pipe(sass.sync({outputStyle: 'expanded'}).on('error', sass.logError))
    // 3. where to save compiled css?
    .pipe(gulp.dest('docs/css'))
    // 4. stream changes to all browsers
    .pipe(browserSync.stream());
}

function watch() {
    // 1. Initialize browserSync
    browserSync.init({
        server: {
            // 2. Identify where the root directory of the server is
            baseDir: 'docs'
        }
    });

    //  Arguments: 
    //      1) path: where to look for changes, 
    //      2) callback: which Gulp functions to run
    gulp.watch('app/pages/**/*.njk', nunjucks);
    gulp.watch('app/templates/**/*.njk', nunjucks);
    gulp.watch('app/scss/**/*.scss', style);
    gulp.watch('docs/*.html').on('change', browserSync.reload);
    gulp.watch('docs/js/**/*.js').on('change', browserSync.reload)
}

// these make the functions accessable from the command line by writing gulp and then the value.
exports.watch = watch;
