const azure = require("azure-storage"),
 streamifier = require("streamifier");

console.log(process.env);
const blobSvc = azure.createBlobService();

blobSvc.createContainerIfNotExists('photos', {publicAccessLevel : 'blob'}, function(error, result, response){
    if(error)
        console.log(error);
});

class storage {
    static uploadPhoto(file){
        var stream = streamifier.createReadStream(file.buffer);
         blobSvc.createBlockBlobFromStream(
            'photos',
            file.originalname,
            stream,
            file.size,
            function(error, result, response){
                console.log(error,result,response);
                if(error){
                    console.log("Couldn't upload stream");
                    console.error(error);
                } else {
                    console.log('Stream uploaded successfully');
                }
            });

    }
}
module.exports = storage;