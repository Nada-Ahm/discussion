const multer = require("multer");
const path = require("path");
const fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '--' + path.extname(file.originalname))
    },
});

const upload = multer({ storage:fileStorageEngine }); 
module.exports = upload;