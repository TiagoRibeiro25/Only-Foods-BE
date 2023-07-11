import cloudinary, { ConfigOptions } from 'cloudinary';

const options: ConfigOptions = {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.v2.config(options);

export default cloudinary.v2;
