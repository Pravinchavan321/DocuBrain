const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const path = require('path');

async function testExtraction() {
  try {
    const filePath = 'c:/Users/DELL/Desktop/docubrain/server/uploads/1776988728787-b520a320.pdf';
    console.log('Testing extraction for:', filePath);
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    console.log('Num Pages:', data.numpages);
    console.log('Text Length:', data.text.length);
    console.log('Sample Text:', data.text.substring(0, 500));
  } catch (err) {
    console.error('Extraction failed:', err.message);
  }
}

testExtraction();
