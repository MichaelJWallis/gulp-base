// ===========================================================================
// Paths =====================================================================
// ===========================================================================

/*** Assets Directories ***/
var assetsdir_sass = 'assets/sass/**/*.scss';

var assetsdir_alljs = 'assets/js/**/*.js';
var assetsdir_authorjs = 'assets/js/*.js';
var assetsorder_js = ['assets/js/lib/**/*.js', 'assets/js/vendor/**/*.js', 'assets/js/*.js'];

var assetsdir_images = 'assets/img/**/*';

var assetsdir_sprites = 'assets/img/sprites/**/*';
var assetsdir_spriteCSS = 'assets/sass';

/*** Distribution Directories ***/
var distdir_css = 'public/css';

var distdir_js = 'public/js';
var distname_js = 'app.js';

var distdir_images = 'public/img';
var distdir_sprites = 'public/img/sprites';

var distdir_templates = 'public/includes';
var template_stylesheets = '/stylesheets.html';
var template_scripts = '/scripts.html';

// ===========================================================================
// Initialization ============================================================
// ===========================================================================

/*** Gulp init ***/
var gulp = require('gulp');

/*** Auto plugin loading init ***/
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

/*** Node package inits ***/
var del = require('del');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');

/*** Timestamp Variable ***/
var runTimestamp = Math.round(Date.now()/1000);

// ===========================================================================
// SASS ======================================================================
// ===========================================================================

/*** SASS Compilation, Minification and Sourcemaps writing ***/
gulp.task('sass', function() {
    return gulp.src(assetsdir_sass)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.plumber({
          errorHandler: function (err) {
              console.log(err);
              this.emit('end');
          }
      }))
      .pipe(plugins.sass())
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cssnano())
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(distdir_css))
      .pipe(plugins.livereload());
});

// ===========================================================================
// Javascript ================================================================
// ===========================================================================

/*** Javascript Linting ***/
gulp.task('lintjs', function() {
    return gulp.src(assetsdir_authorjs)
      .pipe(plugins.plumber({
          errorHandler: function (err) {
              console.log(err);
              this.emit('end');
          }
      }))
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'));
});

/*** Javascript Concatenation, Minification and Sourcemaps writing ***/
gulp.task('buildjs', function() {
  return gulp.src(assetsorder_js)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(plugins.concat(distname_js))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(distdir_js))
    .pipe(plugins.livereload());
});

// ===========================================================================
// Images ====================================================================
// ===========================================================================

/*** Image optimization ***/
gulp.task('imagemin', function() {
    return gulp.src([assetsdir_images, ('!' + assetsdir_sprites)])
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(plugins.changed(distdir_images))
        .pipe(plugins.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(distdir_images))
        .pipe(plugins.livereload());
});

/*** Sprite creation ***/
gulp.task('spritecreate', function() {

    var spriteData = gulp.src(assetsdir_sprites)
                        .pipe(plugins.spritesmith({
                            imgName: 'sprite.png',
                            cssName: 'sprite.css'
                        }));

    var imgstream = spriteData.img
                        .pipe(buffer())
                        .pipe(plugins.imagemin())
                        .pipe(gulp.dest(distdir_sprites));

    var cssStream = spriteData.css
                        .pipe(plugins.cssnano())
                        .pipe(plugins.rename('_sprite.scss'))
                        .pipe(gulp.dest(assetsdir_spriteCSS));

    return merge(imgstream, cssStream);

});

// ===========================================================================
// Asset Injection ===========================================================
// ===========================================================================

gulp.task('stylesinject', function() {
    var target = gulp.src(distdir_templates + template_stylesheets);
    var sources = gulp.src([distdir_css + '/**/*.css'], {read: false});
    return target.pipe(plugins.inject(sources, { ignorePath: 'public', addRootSlash: true }))
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(distdir_templates));
});

gulp.task('scriptsinject', function() {
    var target = gulp.src(distdir_templates + template_scripts);
    var sources = gulp.src([distdir_js + '/**/*.js'], {read: false});
    return target.pipe(plugins.inject(sources, { ignorePath: 'public', addRootSlash: true }))
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(distdir_templates));
});

// ===========================================================================
// Asset Cleaning ============================================================
// ===========================================================================

gulp.task('delete', function() {
   return del([
       distdir_css + '/**/*',
       distdir_js + '/**/*',
       distdir_images + '/**/*'
       ]);
});

gulp.task('emptystyles', function() {
    return gulp.src(distdir_templates + template_stylesheets)
        .pipe(plugins.deleteLines({
            'filters': [
                /<link\s+rel=["']/i
                ]
        }))
        .pipe(gulp.dest(distdir_templates));
});

gulp.task('emptyscripts', function() {
    return gulp.src(distdir_templates + template_scripts)
        .pipe(plugins.deleteLines({
            'filters': [
                /<script\s+src=/i
                ]
        }))
        .pipe(gulp.dest(distdir_templates));
});

// ===========================================================================
// Sequences =================================================================
// ===========================================================================

// Sequence for sprite creation
gulp.task('sprite', function(callback) {
   plugins.sequence('spritecreate', 'sass')(callback)
});

// Cleaning Sequence
gulp.task('clean', function(callback) {
    plugins.sequence(['delete', 'emptystyles', 'emptyscripts'])(callback)
});

// ===========================================================================
// Watch Task ================================================================
// ===========================================================================

gulp.task('watch', function() {

    plugins.livereload.listen();
    gulp.watch(assetsdir_sass, ['sass']);
    gulp.watch(assetsdir_alljs, ['buildjs']);
    gulp.watch(assetsdir_images, ['imagemin']);
    gulp.watch(assetsdir_sprites, ['sprite']);

});

// ===========================================================================
// Build =====================================================================
// ===========================================================================

gulp.task('build', function(callback) {
    plugins.sequence('clean', 'spritecreate', ['sass', 'buildjs', 'imagemin'], ['stylesinject', 'scriptsinject'])(callback)
});
