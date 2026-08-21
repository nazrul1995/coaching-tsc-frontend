// export const uploadImage = async (imageFile: File): Promise<string> => {
//   const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

//   try {
//     const formData = new FormData();
//     formData.append('image', imageFile);

//     const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
//       method: 'POST',
//       body: formData,
//     });

//     const data = await res.json();

//     if (data.success && data.data?.url) {
//       return data.data.url;
//     }

//     throw new Error(data?.error?.message || 'ImgBB upload failed');
//   } catch (error) {
//     console.warn('ImgBB Service Error/Down. Switching to Cloudinary fallback...', error);
    
//     // ImgBB ফেল করলে Cloudinary দিয়ে চেষ্টা করবে
//     return await uploadImageToCloudinary(imageFile);
//   }
// };


export const uploadImageToImgBB = async (imageFile: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables missing');
  }

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }

  return data.secure_url;
};