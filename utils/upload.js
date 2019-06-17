const GoogleStorage = require('@google-cloud/storage').Storage;
var storageConfig = require('./../config/storage');

const storage = new GoogleStorage({
    projectId: storageConfig.firebase.projectID,
    credentials: storageConfig.firebase.keyFileName
});
const bucket = storage.bucket(storageConfig.firebase.bucket);

module.exports = {
    uploadSingleThumbnail: (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('No image file');
            }
            
            let newFileName = `${ file.originalname }_${ Date.now() }`;
            let fileUpload = bucket.file('/article thumbnail/' + newFileName);
            const blobStream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });
      
            blobStream.on('error', (error) => {
                reject('Something is wrong! Unable to upload at the moment.');
            });
      
            blobStream.on('finish', (abc) => {
            // The public URL can be used to directly access the file via HTTP.
                const url = `https://storage.googleapis.com/${ bucket.name }/${ fileUpload.name }`;
                resolve(url);
            });
      
            blobStream.end(file.buffer);
        });
    },
};

