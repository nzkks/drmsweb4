import path from 'path';
import del from 'del';
import glob from 'glob';
import gulp from 'gulp';
import gutil from 'gulp-util';
import pluginsFactory from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import lazypipe from 'lazypipe';
import child_process from 'child_process';
import builder from './builder';


function exitAfter(done) {
  return function(err) {
    done(err);
    process.exit();
  };
}

const plugins = pluginsFactory();
const gp = builder.globPatterns;

function mapScript(p) {
  return  gutil.replaceExtension(p, '.js');
}

let makeScriptPipe = function() {
  let jsFilter = plugins.filter([gp.JS], {restore: true});
  let lp = lazypipe()
    .pipe(() => jsFilter)
    .pipe(plugins.eslint)
    .pipe(plugins.eslint.format)
    .pipe(plugins.babel)
    .pipe(() => jsFilter.restore);
  return lp();
};

gulp.task('clean', done => del(builder.dirs.tgt.root, done)
);

gulp.task('build-server-scripts', function() {
  let dest = `${builder.dirs.tgt.server}/scripts`;
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.src.server}/scripts`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest, map: mapScript}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest))
    .pipe(builder.sync.reloadServer())
    .pipe(builder.mocha.rerunIfWatch());
});

gulp.task('build-server-templates', function() {
  let dest = `${builder.dirs.tgt.server}/templates`;
  return gulp.src([gp.PUG], {cwd: `${builder.dirs.src.server}/templates`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest}))
    .pipe(plugins.ejs({builder}))
    .pipe(builder.crusher.puller())
    .pipe(gulp.dest(dest))
    .pipe(builder.sync.reloadServer())
    .pipe(builder.mocha.rerunIfWatch());
});

gulp.task('build-server-config', function() {
  let dest = `${builder.dirs.tgt.server}/config`;
  return gulp.src([gp.ALL], {cwd: `${builder.dirs.src.server}/config`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs({builder}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest));
});

gulp.task('build-starter', function() {
  let dest = __dirname;
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.src.server}/starter`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs({builder}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest));
});

gulp.task('build-client-bundles', () => {
  let opt = {
    entry: path.join(builder.dirs.src.client, 'scripts', 'main.js'),
    uglify: builder.config.mode.isProduction,
  };
  if (builder.watchEnabled) {
    return builder.bundler.startDevServer(opt);
  } else {
    let dest = `${builder.dirs.tgt.client}/bundles`;
    return builder.bundler.createStream(opt)
      .pipe(gulp.dest(dest));
  }
});

gulp.task('build-client-images', () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.client}/images`})
    .pipe(builder.plumber())
    .pipe(builder.crusher.pusher())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/images`))
    .pipe(builder.sync.reloadClient())
);

gulp.task('copy-client-pages', () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.client}/pages`})
    .pipe(builder.plumber())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/pages`))
    .pipe(builder.sync.reloadClient())
);

gulp.task('copy-client-fonts', () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.client}/fonts`})
    .pipe(builder.plumber())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/fonts`))
    .pipe(builder.sync.reloadClient())
);

gulp.task('copy-client-files', () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.client}/files`})
    .pipe(builder.plumber())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/files`))
    .pipe(builder.sync.reloadClient())
);

gulp.task('build-client-styles', function() {
  let templateConfig = {};
  let includePaths = [];
  templateConfig.normalizeScssPath = 'node_modules/node-normalize-scss';
  templateConfig.normalizeScssMain = templateConfig.normalizeScssPath + '/' + '_normalize.scss';
  templateConfig.susySassPath = 'node_modules/susy/sass';
  templateConfig.susySassMain = templateConfig.susySassPath + '/' + '_susy.scss';
  templateConfig.breakpointSassPath = 'bower_components/breakpoint-sass/stylesheets';
  templateConfig.breakpointSassMain = templateConfig.breakpointSassPath + '/' + '_breakpoint.scss';
  templateConfig.fancyboxScssPath = 'node_modules/fancybox/dist/scss';
  templateConfig.fancyboxScssMain = templateConfig.fancyboxScssPath + '/' + 'jquery.fancybox.scss';
  templateConfig.slickScssPath = 'node_modules/slick-carousel/slick';
  templateConfig.slickScssMain = templateConfig.slickScssPath + '/' + 'slick.scss';
  templateConfig.slickThemeScss = templateConfig.slickScssPath + '/' + 'slick-theme.scss';
  let sassFilter = plugins.filter([gp.SASS], {restore: true});
  let scssFilter = plugins.filter([gp.SCSS], {restore: true});
  return gulp.src([gp.CSS, gp.SASS, gp.SCSS], {cwd: `${builder.dirs.src.client}/styles`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs(templateConfig))
    .pipe(sassFilter)
    .pipe(plugins.sass({includePaths, indentedSyntax: true}))
    .pipe(sassFilter.restore)
    .pipe(scssFilter)
    .pipe(plugins.sass({includePaths}))
    .pipe(scssFilter.restore)
    .pipe(builder.crusher.pusher())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/styles`))
    .pipe(builder.sync.reloadClient());
});

gulp.task('build-client-vendor-slickcarousel-fonts', () =>
  gulp.src(['**/*'], {cwd: 'node_modules/slick-carousel/slick/fonts'})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/slick-carousel/fonts`))
);

gulp.task('build-client-vendor-slickcarousel-loader', () =>
  gulp.src(['**/ajax-loader.gif'], {cwd: 'node_modules/slick-carousel/slick'})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/slick-carousel/`))
);

gulp.task('build-client-vendor-fancybox-assets', () =>
  gulp.src(['**/*.{jpg,png,svg,gif,webp,ico}'], {cwd: 'node_modules/fancybox/dist/img'})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/fancybox/img`))
);

gulp.task('nop', function() {});

gulp.task('build-client-vendor-assets', done =>
  runSequence([
    'build-client-vendor-slickcarousel-fonts',
    'build-client-vendor-slickcarousel-loader',
    'build-client-vendor-fancybox-assets',
    'nop'
  ], done)
);

gulp.task('build-test-server-scripts', function() {
  let dest = `${builder.dirs.tgt.serverTest}/scripts`;
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.test.server}/scripts`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest, map: mapScript}))
    .pipe(plugins.ejs({builder}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest))
    .pipe(builder.mocha.rerunIfWatch());
});

gulp.task('build-test-client-bundles', () => {
  let opt = {
    entry: glob.sync(path.join(builder.dirs.test.client, 'scripts', '*.test.js')),
    watch: builder.watchEnabled,
  };
  let dest = `${builder.dirs.tgt.client}/bundles`;
  let bundleStream = builder.bundler.createStream(opt, (err) => {
    gutil.log('webpack bundle done.%s', err === null ? '' : ' ERROR: ' + err);
    builder.karma.rerun();
  });
  let result = bundleStream
    .pipe(gulp.dest(dest));
  if (!builder.watchEnabled) {
    return result;
  }
});

gulp.task('pack', function(done) {
  let tar = child_process.spawn('tar', [
    '-czf',
    'dist.tar.gz',
    'package.json',
    'server.js',
    builder.dirs.tgt.root
  ]);
  tar.on('close', function(code) {
    if (code) {
      done(new Error(`tar failed with code ${code}`));
    } else {
      done();
    }
  }
  );
});

gulp.task('serve', () => {
  return builder.server.start();
});

gulp.task('start-sync', () =>
  builder.sync.start()
);

gulp.task('mocha', () =>
  builder.mocha.start()
);

gulp.task('karma', ()  =>
  builder.karma.start({singleRun: true})
    .then(() =>
      builder.server.stop()
    )
);

gulp.task('karma-watch', () => {
  // don't wait for stop
  builder.karma.start({singleRun: false});
});


gulp.task('build-server-assets', done =>
  runSequence([
    'build-server-templates'
  ], done)
);

gulp.task('build-server', done =>
  runSequence([
    'build-server-scripts',
    'build-server-assets',
    'build-server-config'
  ], done)
);

gulp.task('build-client-assets', done =>
  runSequence([
    'build-client-images',
    'build-client-styles',
    'copy-client-pages',
    'copy-client-fonts',
    'copy-client-files',
    'build-client-vendor-assets'
  ], done)
);

gulp.task('build-client', done =>
  runSequence([
    'build-client-assets',
    'build-client-bundles'
  ], done)
);

gulp.task('build-test', done =>
  runSequence([
    'build-server',
    'build-client-assets',
    'build-test-server-scripts',
    'build-test-client-bundles'
  ], done)
);

gulp.task('build', function(done) {
  let tasks = [
    'build-server',
    'build-client'
  ];
  if (builder.config.mode.isProduction) {
    tasks.push('build-starter');
  }
  return runSequence(tasks, done);
});


gulp.task('watch-on', () =>
  builder.watchEnabled = true
);

gulp.task('headless-on', () =>
  builder.headlessEnabled = true
);

gulp.task('crush-on', () =>
  builder.crusher.enabled = true
);

gulp.task('watch-server-assets', () =>
  gulp.watch([`${builder.dirs.src.server}/templates/${gp.ALL}`], ['build-server-templates'])
);

gulp.task('watch-server-scripts', () =>
  gulp.watch([`${builder.dirs.src.server}/scripts/${gp.SCRIPT}`], ['build-server-scripts'])
);

gulp.task('watch-server', ['watch-server-assets', 'watch-server-scripts']);

gulp.task('watch-client-assets', () => {
  gulp.watch([`${builder.dirs.src.client}/styles/${gp.ALL}`], ['build-client-styles']);
  gulp.watch([`${builder.dirs.src.client}/images/${gp.ALL}`], ['build-client-images']);
  gulp.watch([`${builder.dirs.src.client}/pages/${gp.ALL}`], ['copy-client-pages']);
  gulp.watch([`${builder.dirs.src.client}/fonts/${gp.ALL}`], ['copy-client-fonts']);
  gulp.watch([`${builder.dirs.src.client}/files/${gp.ALL}`], ['copy-client-files']);
});

gulp.task('watch-test-server-scripts', () =>
    gulp.watch([`${builder.dirs.test.server}/scripts/${gp.SCRIPT}`], ['build-test-server-scripts'])
);

gulp.task('watch-client', ['watch-client-assets']);

gulp.task('watch', ['watch-server', 'watch-client']);

gulp.task('watch-test', ['watch-test-server-scripts']);

gulp.task('run', done => runSequence('clean', 'build', 'serve', done)
);

gulp.task('run-watch', done => runSequence('watch-on', 'clean', 'build', 'serve', 'start-sync', 'watch', done)
);

gulp.task('test', done =>
  runSequence('crush-on', 'clean', 'build-test', 'serve', 'mocha', 'karma',
    exitAfter(done))
);

gulp.task('test-ci', done => runSequence(
      'crush-on', 'headless-on', 'clean', 'build-test',
      'serve', 'mocha', 'karma',
      exitAfter(done))
);

gulp.task('test-watch', done => runSequence(
      'watch-on', 'clean', 'build-test', 'serve', 'mocha', 'karma-watch',
      'watch-server', 'watch-client-assets', 'watch-test',
      done)
);

gulp.task('dist', done => runSequence('crush-on', 'clean', 'build', 'pack', done)
);

gulp.task('default', ['run-watch']);
