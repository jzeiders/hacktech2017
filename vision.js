"use strict"
const VISION_URL = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/describe';
const request = require("request");

class visionAPI {
    constructor() {}
    static getCaptionData(url) {
        return new Promise((res, rej) => {
            var requestData = {
                url: VISION_URL,
                headers: {
                    "Ocp-Apim-Subscription-Key":"27cfc6c78b6b443da988b177ef733f67"
                },
                json: {
                    'url': url
                }
            };
            request.post(requestData, function (err, response, body) {
                if (err) 
                    rej(err);
                body.url = url;
                res(body);
            })
        });
    }
};

module.exports = visionAPI;