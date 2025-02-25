const axios = require("axios");
const FormData = require("form-data");
const Image = require("../models/Image.modal");

const uploadImageToImgBB = async (fileBuffer, userId) => {
  try {
    if (!fileBuffer || !userId) {
      throw new Error("Image file and userId are required!");
    }

    const API_KEY = process.env.IMGBB_API_KEY; // Ensure API key is in your environment variables

    // Prepare the image as Base64 for ImgBB
    const formData = new FormData();
    formData.append("image", fileBuffer.toString("base64"));

    // Upload image to ImgBB
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to upload image to ImgBB");
    }

    // Extract image info from the response
    const { url, delete_url } = response.data.data;

    // Return the image details and URL
    return { imageUrl: url, deleteUrl: delete_url };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

module.exports = uploadImageToImgBB;
