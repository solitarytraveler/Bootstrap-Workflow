'use strict'

import fs from 'fs';
import yaml from 'js-yaml';
import yargs from 'yargs';
import del from 'rimraf';
import browsersync from 'browser-sync';
import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import mergeStream from 'merge-stream';

const $          = gulpPlugins()
const browser    = browsersync.create()
const production = yargs.argv.production
const config     = yaml.load(fs.readFileSync('config.yml', 'utf8'))

gulp.task('build', gulp.series(clean, gulp.parallel(sass, javascript, images, fonts, html, copy)))
gulp.task('default', gulp.series('build', server, watch))

/* Remove old distribution folder */
function clean(callback) {
	del(config.dist, callback)
}

/* Copy assets files task, images, javascript and sass file are excluded */
function copy() {
	/* copy assets files (not sass|js|image)*/
	return gulp.src(config.copy)
	.pipe(gulp.dest(config.dist))
}

/* Copy Font*/
function fonts() {
	let streams = [];
	for (let font in config.fonts) {
		let stream = gulp
		.src(config.fonts[font])
		.pipe(gulp.dest(config.dist + 'fonts/' + font + '/'));
		streams.push(stream);
	}

	return mergeStream(streams);
}

/* Copy HTML */
function html() {
	return gulp.src('src/pages/**/*.html')
	.pipe($.nunjucksRender({
		ext: '.html',
		path: config.templates,
	}).on('error', e => console.log(e)))
	.pipe(gulp.dest(config.dist))
}

/* Image Task */
function images() {
	return gulp.src(config.images)
	.pipe($.imagemin({progressive: true}))
	.pipe(gulp.dest(config.dist + '/img'))
}

/* Sass task */
function sass() {
	return gulp.src('src/assets/sass/style.scss')
	.pipe($.sourcemaps.init())
	.pipe($.sass({includePaths: config.sass}).on('error', $.sass.logError))
	.pipe($.autoprefixer({browsers: config.support, cascade: false}))
	.pipe($.if(production, $.cssnano()))
	.pipe($.if(!production, $.sourcemaps.write()))
	.pipe(gulp.dest(config.dist + '/css'))
	.pipe(browser.reload({stream: true}));
}

/* Javascript Task */
function javascript() {
	let components = gulp.src(config.javascript.components)
	.pipe($.sourcemaps.init())
	.pipe($.if(production, $.uglify().on('error', e => console.log(e))))
	.pipe($.if(!production, $.sourcemaps.write()))
	.pipe(gulp.dest(config.dist + '/js'));

	let bootstrap = gulp.src(config.javascript.bootstrap)
	.pipe($.sourcemaps.init())
	.pipe($.concat('script.js'))
	.pipe($.if(production, $.uglify().on('error', e => console.log(e))))
	.pipe($.if(!production, $.sourcemaps.write()))
	.pipe(gulp.dest(config.dist + '/js'));

	return mergeStream(components, bootstrap);
}

/* BrowserSync Server */
function server(callback) {
	browser.init({
		server: {
			baseDir: config.server.path,
		},
		port: config.server.port
	});

	callback();
}

function watch() {
	gulp.watch(config.copy, copy);
	gulp.watch(config.templates).on('all', gulp.series(html, browser.reload))
	gulp.watch('src/assets/sass/**/*.scss').on('all', gulp.series(sass, browser.reload))
	gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(javascript, browser.reload))
	gulp.watch(config.images).on('all', gulp.series(images, browser.reload))
}
