var gulp = require('gulp');
var gutil = require('gulp-util');
//var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
//var sh = require('shelljs');
var uglify = require('gulp-uglify');
var spriter = require('gulp-css-spriter')
var livereload = require('gulp-livereload');
//var templateCache = require('gulp-angular-templatecache');
//合并js
gulp.task('js',function(){
    gulp.src('./src/js/**/*.js')
        //.pipe(uglify())             //混淆文件
        .pipe(livereload())
        .pipe(gulp.dest('C:/work/ejavashop/ejavashop-front/src/main/webapp/resources/frontV1/js'))       //将混淆后文件放入目标文件夹
});
//合并css  用scss注意所有css文件后缀为scss
gulp.task('sass', function(done) {
  var timestamp = +new Date();
  var vision = '1.00';
  gulp.src('./src/sass/layout/**/*.scss')
    .pipe(sass())                     //合并
    .pipe(gulp.dest('./src/css'))  //合并后放入目标文件夹
    .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': 'C:/work/ejavashop/ejavashop-front/src/main/webapp/resources/frontV1/sprite/sprite_v='+vision+'.png',
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '../../sprite/sprite_v='+vision+'.png' //这是在css引用的图片路径，很重要
        }))
	//.pipe(minifyCss({                   //混淆
      //keepSpecialComments: 0
    //}))
    .pipe(gulp.dest('./src/css'))
    .pipe(rename({ extname: '.css' }))  //加后缀
    .pipe(gulp.dest('C:/work/ejavashop/ejavashop-front/src/main/webapp/resources/frontV1/css'))  //混淆文件放入目标文件夹
    .pipe(livereload())
    .on('end', done);
});
//监听html
gulp.task('html',function(){
    gulp.src('./src/html/**/*.html')
    .pipe(rename({ extname: '.html' }))  //混淆后加后缀
    .pipe(gulp.dest('C:/work/ejavashop/ejavashop-front/src/main/webapp/resources/frontV1/html'))  //混淆文件放入目标文件夹
    .pipe(livereload());
});
//gulp watch 监听

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch('./src/sass/**/*.scss',['sass']);
    gulp.watch('./src/js/**/*.js',['js']);
    gulp.watch('./src/html/**/*.html',['html']);
});