const azure = require("azure-storage"),
    streamifier = require("streamifier"),
    jimp = require('jimp'),
    uuid = require("node-uuid");

const blobSvc = azure.createBlobService();
const baseUrl = "https://turestorage.blob.core.windows.net/photos/"
blobSvc.createContainerIfNotExists('photos', {
    publicAccessLevel: 'blob'
}, function (error, result, response) {
    if (error) 
        console.log(error);
    }
);

class storage {
    static uploadPhoto(file) {
        return new Promise(function (res, rej) {
            jimp
                .read(file.buffer, function (err, image) {
                    image
                        .resize(250, jimp.AUTO)
                        .getBuffer(jimp.MIME_PNG, function (err, smallBuffer) {
                            console.log("resized");
                            var stream = streamifier.createReadStream(smallBuffer);
                            var urlId = uuid.v4();
                            blobSvc.createBlockBlobFromStream('photos', urlId, stream, file.size, function (error, result, response) {
                                console.log(error, result, response);
                                if (error) {
                                    console.log("Couldn't upload stream");
                                    rej(error);
                                } else {
                                    console.log('Stream uploaded successfully');
                                    res(baseUrl + urlId);
                                }
                            });
                        })
                });
        })
    }
}
module.exports = storage;