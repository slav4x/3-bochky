const { src, dest, parallel, series, watch } = require('gulp');

const bs = require('browser-sync');
const njk = require('gulp-nunjucks-render');
const sass = require('gulp-sass')(require('sass'));
const prefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const noop = require('gulp-noop');
const listing = require('is-pagelist');
const typograf = require('gulp-typograf');

const isMinify = true;

const clean = () => del(['app']);

const html = () => {
  return src(['src/**/*.html', '!src/components/**/*.html'])
    .pipe(njk({ path: 'src/' }))
    .pipe(replace('?cb', '?cb=' + new Date().getTime()))
    .pipe(typograf({ locale: ['ru', 'en-US'], htmlEntity: { type: 'digit' } }))
    .pipe(isMinify ? replace('libs.css', 'libs.min.css') : noop())
    .pipe(isMinify ? replace('main.css', 'main.min.css') : noop())
    .pipe(isMinify ? replace('libs.js', 'libs.min.js') : noop())
    .pipe(isMinify ? replace('main.js', 'main.min.js') : noop())
    .pipe(dest('app'))
    .pipe(bs.stream());
};

const style = () => {
  return src(['src/sass/**/*.sass', '!src/sass/libs.sass'])
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'SASS',
          message: error.message,
        })),
      })
    )
    .pipe(sass())
    .pipe(isMinify ? cleanCSS({ level: 2 }) : noop())
    .pipe(isMinify ? prefixer({ overrideBrowserslist: ['last 8 versions'] }) : noop())
    .pipe(isMinify ? concat('main.min.css') : concat('main.css'))
    .pipe(dest('app/css/'))
    .pipe(bs.stream());
};

const libs_style = () => {
  return src('src/sass/libs.sass')
    .pipe(sass())
    .pipe(isMinify ? cleanCSS({ level: 2 }) : noop())
    .pipe(isMinify ? concat('libs.min.css') : concat('libs.css'))
    .pipe(dest('app/css/'));
};

const js = () => {
  return src('src/js/main.js')
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'JavaScript',
          message: error.message,
        })),
      })
    )
    .pipe(isMinify ? uglify() : noop())
    .pipe(isMinify ? concat('main.min.js') : concat('main.js'))
    .pipe(dest('app/js/'))
    .pipe(bs.stream());
};

const libs_js = () => {
  return src(['src/js/vendor/splide.min.js', 'src/js/vendor/fancybox.min.js', 'src/js/vendor/imask.min.js', 'src/js/vendor/aos.js'])
    .pipe(isMinify ? uglify() : noop())
    .pipe(isMinify ? concat('libs.min.js') : concat('libs.js'))
    .pipe(dest('app/js/'));
};

const img = () => {
  return src('src/img/**/*').pipe(dest('app/img'));
};

const resources = () => {
  return src('src/resources/**').pipe(dest('app'));
};

const watching = () => {
  bs.init({
    server: {
      baseDir: 'app',
    },
  });

  watch('src/**/*.html', parallel(html));
  watch('src/**/*.sass', parallel(libs_style, style));
  watch('src/**/*.js', parallel(js));
  watch('src/img/**/*', parallel(img));
  watch('src/resources/**/*', parallel(resources));
};

const pageList = () => {
  return src('app/*.html').pipe(listing('page-list.html')).pipe(dest('app/'));
};

exports.default = series(clean, parallel(libs_js, js, libs_style, style, html, img, resources, watching));
exports.build = series(clean, parallel(libs_js, js, libs_style, style, html, img, resources), pageList);
