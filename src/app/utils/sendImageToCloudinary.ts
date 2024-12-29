import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) reject(error);
        resolve(result as CloudinaryUploadResult);
        //delete file from local storage
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('file is deleted');
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
