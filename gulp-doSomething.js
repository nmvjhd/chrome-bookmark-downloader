/**
 * Created by matengfei on 2017/6/9.
 */
'use strict';
const through = require('through2');

module.exports = function (processer) {

    function doSomething(file, encoding, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(createError(file, 'Streaming not supported'));
        }
        //do something
        const sourceContent = file.contents.toString();
        file.contents = Buffer.from(processer(sourceContent));

        callback(null, file);
    }

    return through.obj(doSomething);
};