export const fileFromUrl = async function createFileFromUrl(url, filename) {
  try {
    // Fetch the file data from the URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Create a File object from the fetched blob
    const file = new File([blob], filename, { type: blob.type });
    file.objectURL = URL.createObjectURL(file);
    return file;
  } catch (error) {
    console.error("Error creating File from URL:", error);
    return null;
  }
};
