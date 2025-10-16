import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUploader } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUploader,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // empty space remove replace with dash
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, ""); // non alpha numeric - !@#$

      const unique_Id =
        Math.random().toString(36).substring(2) + "-" + Date.now() + fileName;
      return unique_Id;
    },
  },
});

export const multerUpload = multer({ storage: storage });
