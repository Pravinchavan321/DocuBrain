const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromFile = async (filePath, mimeType, originalName) => {
  const ext = originalName ? originalName.split('.').pop().toLowerCase() : '';
  
  if (ext === 'txt' || mimeType === 'text/plain') {
    return await fs.readFile(filePath, 'utf8');
  } 
  
  if (ext === 'pdf' || mimeType === 'application/pdf') {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  
  if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error(`Unsupported file type for extraction: ${ext || mimeType}`);
};

module.exports = {
  extractTextFromFile
};
