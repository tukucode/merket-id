import multer from "multer";
import path from "path";
import Messages from "../utils/messages.js";

const Storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname.toLowerCase());
    const uniqueSuffix = `img_${Date.now()}${ext}`;
    cb(null, uniqueSuffix);
  },
});

const Upload = multer({
  storage: Storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    // image.PNG ===> image.png
    const ext = path.extname(file.originalname.toLowerCase());
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      const newMessage = {
        message: "Extention image must be jpg/jpeg/png",
        code: "wrongtype",
      };
      cb(newMessage, false);

      return;
    }

    cb(null, true);
  },
});

// middleware upload_img
const uploadImg = (req, res, next) => {
  const upload = Upload.single("image");

  upload(req, res, (err) => {
    if (err) {
      const { message, code } = err;
      if (code === "LIMIT_FILE_SIZE") {
        Messages(res, 413, message);
      } else if (code === "wrongtype") {
        Messages(res, 400, message);
      } else {
        Messages(res, 500, "Something wrong when upload image", err);
      }
    } else {
      next();
    }
  });
};

export default uploadImg;
