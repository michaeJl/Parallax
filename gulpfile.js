"use strict";
// .pipe(rename({
        //   prefix: "",
        //   suffix: ".min",
        // })) можно удобно и просто изменить файл

const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const webpack = require("webpack-stream");
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');


const dist = "./dist/";

gulp.task("copy-html", () => {
    return gulp.src("./src/index.html")
                .pipe(gulp.dest(dist))
                .pipe(browserSync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browserSync.reload);
});

gulp.task("copy-assets", () => {
    return gulp.src(["./src/assets/**/*.*", "!src/assets/sass/*.+(scss|sass)"])
                .pipe(gulp.dest(dist + "/assets"))
                .on("end", browserSync.reload);
});

gulp.task('styles',function(){
    return gulp.src("./src/assets/sass/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
          cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("./src/assets/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    browserSync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });

    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch(["./src/assets/**/*.*", "!src/assets/sass/*.+(scss|sass)"], gulp.parallel("copy-assets"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
    gulp.watch("./src/assets/sass/*.+(scss|sass)", gulp.parallel("styles"));
});

gulp.task("build",gulp.series("styles", "build-js",gulp.parallel("copy-html", "copy-assets")) );

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task('default', gulp.parallel('watch','build'));