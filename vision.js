"use strict"
const VISION_URL = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/describe';
const EMOTION_URL = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';
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
    static getEmotions(url) {
        console.log(url);
        return new Promise((res,rej) => {
            var requestData = {
                url: EMOTION_URL,
                headers: {
                    "Ocp-Apim-Subscription-Key":"83e47b5802d44a649af1e4214424951f"
                },
                json: {
                    'url': url
                }
            }
            request.post(requestData, function (err, response, body) {
                if (err) 
                    rej(err);
                if(body[0])
                    res(body[0].scores.happiness);
                res(0.5);
            })
        });
    }
};

module.exports = visionAPI;