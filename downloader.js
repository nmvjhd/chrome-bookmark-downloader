/**
 * Created by Administrator on 2017/10/14.
 */
const fetch = require('node-fetch');
const nodePath = require('path');
const fs = require('fs');

function transform(sourceContent) {
  // let targetContent = sourceContent.replace(/(\/\*([^]*?)\*\/)|(\/\/.*)/g,''); //去掉字符串中的代码注释（包括当行与多行)
  // let targetContent = `(function(){${sourceContent}})()`;  //给文件加上IIFE
  // let targetContent = sourceContent.match(/HREF="(.*?)(?=")/g).map(item => item.replace("HREF=\"","")).join('\n');    //提取chrome收藏夹书签文件中所有的网址

  const urls = sourceContent.match(/HREF="(.*?)(?=")/g).map(item => item.replace("HREF=\"", ""));
  const titles = sourceContent.match(/\"\>.*(?=\<\/A\>)/g).map(item => item.replace("\">",""));
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
  const indexPageContent = makeIndexPage(items);
  return indexPageContent;
}

function downloadPage(url, fileName) {
  fetch(url)
    .then(res => res.text())
    .then(txt => {
      fs.writeFile(fileName,txt,cb => {
        console.log(`download page:${url} to file:${fileName} success`);
      });
    }).catch(err => console.error(`文件: ${fileName},URL: ${url}下载失败`));
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

module.exports = transform;