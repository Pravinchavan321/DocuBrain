const chunkText = (text, options = {}) => {
  const { chunkSize = 800, overlap = 100 } = options;
  if (!text || typeof text !== 'string') return [];

  const chunks = [];
  let index = 0;
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    if (endIndex > text.length) {
      endIndex = text.length;
    } else {
      // Try to back up to the nearest whitespace to avoid cutting words
      let lastSpace = text.lastIndexOf(' ', endIndex);
      if (lastSpace > startIndex + Math.floor(chunkSize / 2)) {
        endIndex = lastSpace;
      }
    }

    const chunkStr = text.substring(startIndex, endIndex).trim();
    if (chunkStr) {
      chunks.push({
        index,
        text: chunkStr
      });
      index++;
    }

    // Advance start index, accounting for overlap
    startIndex = endIndex - overlap;
    
    // Prevent infinite loop if overlap >= chunkSize or no progress
    if (startIndex < endIndex - overlap || startIndex >= text.length) {
      break; 
    }
    // ensure progress
    if (endIndex === text.length) break;
  }

  return chunks;
};

module.exports = {
  chunkText
};
