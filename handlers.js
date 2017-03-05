const storage = require('./databases/storage.js'),
    vision = require('./vision'),
    db = require('./databases/db.js'),
    uuid = require('node-uuid');

class handlers {
    static photo(req) {
        if (!req.body.lat || !req.body.lng) 
            return Promise.reject("Missing GeoLocation");
        console.log("WHY");
        return storage
            .uploadPhoto(req.file)
            .then((url) => {
                console.log("url is:" + url);
                return vision.getCaptionData(url);
            })
            .then((imageData) => {
                console.log("Adding to DB");
                console.log(imageData);
                var photo = {
                    url: imageData.url,
                    lat: parseFloat(req.body.lat),
                    lng: parseFloat(req.body.lng),
                    tags: imageData
                        .description
                        .tags
                        .join(","),
                    caption: imageData.description.captions[0].text
                }
                console.log(photo);
                return db
                    .Photo
                    .create(photo)
            })
            .then((result) => {
                console.log("Added to DB?")
                return result;
            });
    }

    static getAllPhotos() {
        return db
            .Photo
            .findAll({
                order: [
                    ["createdAt", "DESC"]
                ]
            });
    }
    static getAllNearby(lat, lng) {
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        return db
            .Photo
            .findAll({
                where: {
                    $and: [
                        {
                            lng: {
                                $between: [
                                    lng - 1,
                                    lng + 1
                                ]
                            }
                        }, {
                            lat: {
                                $between: [
                                    lat - 1,
                                    lat + 1
                                ]
                            }
                        }
                    ]
                },
                order: [
                    ["createdAt", "DESC"]
                ]
            })
    }

}

module.exports = handlers;