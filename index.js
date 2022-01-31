'use strict';

const querystring = require('querystring'); // Don't install.
const AWS = require('aws-sdk'); // Don't install.
const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');

exports.handler = async(event, context, callback) => {
    let origin = "https://img.tridive.io/" //Custom Origin URL
    console.log(event.Records[0].cf)
    const { request, response } = event.Records[0].cf
    console.log(`request: ${request}`)
    console.log(`response: ${response}`)
    const params = querystring.parse(request.querystring)
    if (!params.w && !params.h) {
        return callback(null, response)
    }
    const { uri } = request
    const [, imageName, extension] = uri.match(/\/?(.*)\.(.*)/)
    let width
    let height
    let format
    width = parseInt(params.w, 10) ? parseInt(params.w, 10) : null;
    height = parseInt(params.h, 10) ? parseInt(params.h, 10) : null;
    format = params.f ? params.f : extension;
    format = format === 'jpg' ? 'jpeg' : format
    console.log(`format: ${format}`)
    console.log(`parmas: ${JSON.stringify(params)}`) // Cannot convert object to primitive value.
    console.log(`name: ${imageName}.${extension}`) // Favicon error, if name is `favicon.ico`.
    console.log(origin + '/' + imageName + '.' + extension)
    const data = await originCheck(origin + '/' + imageName + '.' + extension)
    const resizedImage = await resize(data, width, height)
    const resizedImageByteLength = Buffer.byteLength(resizedImage, 'base64');
    console.log('byteLength: ', resizedImageByteLength);
    if (resizedImageByteLength >= 1 * 1024 * 1024) {
        return callback(null, response);
    }
    response.status = 200;
    response.body = resizedImage.toString('base64');
    response.bodyEncoding = 'base64';
    response.headers['content-type'] = [{
        key: 'Content-Type',
        value: `image/${format}`
    }];
    return callback(null, response);
}

const originCheck = async(uri) => {
    try {
        const body = await axios.get(uri, { responseType: "arraybuffer" })
        return body.data
    }
    catch (err) {
        console.log(`axios err: ${err}`)
    }
}

const resize = async(data, width, height) => {
    try {
        // const result = await sharp(data).resize(200, 100, { fit: "fill" }).toFile("./200x500_outside.jpg");
        const result = await sharp(data).resize(width, height, { fit: "fill" }).toFormat('jpeg').toBuffer()
        return result
    }
    catch (err) {
        console.log(`resize: ${err}`)
    }
}
