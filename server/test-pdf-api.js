const pdfParse = require('pdf-parse');
console.log('Keys:', Object.keys(pdfParse));

async function tryParse() {
  try {
    // Some libraries use .parse()
    if (typeof pdfParse.parse === 'function') {
      console.log('Found .parse()');
    }
    // Some use the class constructor
    if (typeof pdfParse.PDFParse === 'function') {
      console.log('Found PDFParse class');
      const parser = new pdfParse.PDFParse();
      console.log('Parser instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
    }
  } catch (err) {
    console.error(err);
  }
}

tryParse();
