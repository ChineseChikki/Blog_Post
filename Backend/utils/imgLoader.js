const multer = require("multer");
const path = require("path");

//Setting storage engine
const storageEngine = multer.diskStorage({
destination: "./uploads",
filename: (req, file, cb) => {
cb(null, `${Date.now()}--${file.originalname}`);
},
});

//initializing multer
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
  checkFileType(file, cb);
  }
});

//Implementing file filtering logic
const checkFileType = function (file, cb) {
//Allowed file extensions
const fileTypes = /jpeg|jpg|png|gif|svg/;

//check extension names
const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

const mimeType = fileTypes.test(file.mimetype);

if (mimeType && extName) {
return cb(null, true);
} else {
cb("Error: You can Only Upload Images!!");
}
};

module.exports = upload;