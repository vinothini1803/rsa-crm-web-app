export const download = (path, fileName) => {
  // Create a link element
  const downloadLink = document.createElement("a");
  downloadLink.href = path;

  // Set the download attribute to specify the filename
  downloadLink.download = fileName;

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Trigger a click event to initiate the download
  downloadLink.click();

  // Remove the link from the document
  document.body.removeChild(downloadLink);
};