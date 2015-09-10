var gulp = require('gulp');
var del = require('del');
var server = require('gulp-express');

var src = {
  bower: 'bower_components/',
  skeletonfp: 'skeleton/css/',
  skeleton: 'skeleton.css',
  normalize: 'normalize.css',
  jqueryfp: 'jquery/dist/',
  jquery: 'jquery.js'
}

var dst = {
  css: 'public/css/',
  img: 'public/img/',
  js: 'public/js/',
}

gulp.task('copy', function() {
  // copy css
  gulp.src([
      src.bower + src.skeletonfp + src.skeleton,
      src.bower + src.skeletonfp + src.normalize,
    ])
    .pipe(gulp.dest(dst.css));
  // copy javascript
  gulp.src([
      src.bower + src.jqueryfp + src.jquery
    ])
    .pipe(gulp.dest(dst.js))
});

gulp.task('clean', function() {
  del([dst.css + src.skeleton, dst.css + src.normalize]);
  del(dst.js + src.jquery);
});

gulp.task('server', function() {
  server.run(['app.js']);

  // Watch for changes
  gulp.watch([dst.css + '*.css',
    dst.img + '*.png',
    dst.js + '.js'
  ], server.notify);

  gulp.watch(['app.js'], [server.run]);
});
