const azure = require("azure-storage"),
    streamifier = require("streamifier"),
    sharp = require('sharp');

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
        return sharp(file.buffer)
            .resize(200, 200)
            .toBuffer()
            .then((smallBuffer) => {
                var stream = streamifier.createReadStream(smallBuffer);
                return new Promise(function (res, rej) {
                    blobSvc
                        .createBlockBlobFromStream('photos', file.originalname, stream, file.size, function (error, result, response) {
                            console.log(error, result, response);
                            if (error) {
                                console.log("Couldn't upload stream");
                                rej(error)
                            } else {
                                console.log('Stream uploaded successfully');
                                res(baseUrl + file.originalname);
                            }
                        });
                })
            });
    }
}
module.exports = storage;