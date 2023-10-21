const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
/* https://res.cloudinary.com/ruyisbaros/image/upload/v1695215546/whatsapp_api/j7pek5thddo5stmzfmem.jpg */
exports.uploadImageToCloduinary = (file, folder, type) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        folder,
        resource_type: type,
      },
      (err, res) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          resolve({
            url: res.url,
            public_id: res.public_id,
          });
        }
      }
    );
  });
};
exports.deleteImage = async (public_id) => {
  cloudinary.v2.uploader.destroy(public_id, (err, result) => {
    if (err) throw err;
  });
};

function removeTmp(url) {
  fs.unlink(url, (err) => {
    if (err) throw err;
  });
}
