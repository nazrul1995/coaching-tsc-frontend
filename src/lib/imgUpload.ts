export const uploadImageToImgBB = async (imageFile: File) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error('Image upload failed');
  }

  return data.data.url; 
};