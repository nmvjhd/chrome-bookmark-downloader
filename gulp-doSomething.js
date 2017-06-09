/**
 * Created by matengfei on 2017/6/9.
 */
'use strict';
var through = require('through2');
var fetch = require('node-fetch');
var nodePath = require('path');
var fs = require('fs');

module.exports = function (opt) {

    function doSomething(file, encoding, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(createError(file, 'Streaming not supported'));
        }
        //do something
        file.contents = getNewBuffer(file.contents);

        callback(null, file);
    }

    return through.obj(doSomething);
};

function getNewBuffer(sourceBuffer) {
    let sourceContent = sourceBuffer.toString();
    // let targetContent = sourceContent.replace(/(\/\*([^]*?)\*\/)|(\/\/.*)/g,''); //去掉字符串中的代码注释（包括当行与多行)
    // let targetContent = `(function(){${sourceContent}})()`;  //给文件加上IIFE
    // let targetContent = sourceContent.match(/HREF="(.*?)(?=")/g).map(item => item.replace("HREF=\"","")).join('\n');    //提取chrome收藏夹书签文件中所有的网址
    let urls = sourceContent.match(/HREF="(.*?)(?=")/g).map(item => item.replace("HREF=\"", ""));
    let titles = sourceContent.match(/\"\>.*(?=\<\/A\>)/g).map(item => item.replace("\">",""));
    // console.log(titles);
    if(urls.length !== titles.length){
        console.log(`opps!,urls length is ${urls.length},not equal to items length: ${titles.length}`);
        return;
    }

    let items = [];
    urls.forEach((url,idx) => {
        let title = titles[idx];
        let item = {url, title};
        items.push(item);
    });

    items.forEach(item => downloadPage(item.url,`./dist/page/${item.title}.html`));
    let indexPageContent = makeIndexPage(items);
    return Buffer.from(indexPageContent);
}

function downloadPage(url, file) {
    fetch(url)
        .then(res => res.text())
        .then(txt => {
            fs.writeFile(file,txt,cb => {
                console.log(`download page:${url} to file:${file} success`);
            });
        }).catch(err => console.error(`文件: ${file},URL: ${url}下载失败`));
}

function makeIndexPage(items) {
    let aItems = items.map(item => `<a href="./page/${item.title}.html">${item.title}</a><br/>`);
    let pageTpl = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        ${aItems.join('\n')}
    </body>
    </html>`;

    return pageTpl;
}