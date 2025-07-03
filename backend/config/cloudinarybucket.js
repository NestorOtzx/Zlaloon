import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Cargar variables de entorno
dotenvConfig();

const secret = process.env.CLOUDINARY_SECRET;

export const config = function () {
  cloudinary.config({
    cloud_name: 'djsbmso1p',
    api_key: '154366849144454',
    api_secret: secret,
  });
};

export const getCloudinary = () => {return cloudinary;}