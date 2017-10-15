/**
 * Created by matengfei on 2017/6/8.
 */
const gulp = require('gulp');
const doSomething = require('./gulp-doSomething');
const transform = require('./downloader');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const wrapper = require('gulp-wrapper');

const fetch = require('node-fetch');
const nodePath = require('path');
const fs = require('fs');

gulp.task('bookmark',function () {
  return download('./bookmarks_2017_6_9.html', './dist');
});

function download(bookmark, outputPath) {
  return gulp.src(bookmark)
    .pipe(doSomething(transform))
    .pipe(gulp.dest(outputPath));
}

gulp.task('download', async function () {
  const urlPrefix = 'http://www.tmlr.gov.cn/jsp/serch.jsp?item_id=';
  fs.mkdirSync('dist');
  for(let i = 1000;i <= 9999;++i){
    const url = urlPrefix + i;
    const fileName = 'dist/' + i + '.html';
    await downloadPage(url, fileName);
  }
});

gulp.task('concat',function () {
  return gulp.src('./dist/*.html')
    .pipe(replace(/[^]*(<table[^]*table>)[^]*/img,"$1"))
    .pipe(concat('page.html'))
//     .pipe(replace(replace(/([^]*)/,`<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>Title</title>
// </head>
// <body>
//   $1
// </body>
// </html>`)))
    .pipe(wrapper({
      header: `<!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Title</title>
    </head>
    <body>`,
      footer: `</body></html>`
    }))
    .pipe(gulp.dest('./dist2'));
});

function downloadPage(url, fileName) {
  return fetch(url)
    .then(res => res.text())
    .then(txt => {
      return new Promise((resolve,reject) => {
        fs.writeFile(fileName,txt,cb => {
          console.log(`download page:${url} to file:${fileName} success`);
          resolve();
        });
      });
    }).catch(err => console.error(`文件: ${fileName},URL: ${url}下载失败`));
}

gulp.task('default',['download']);