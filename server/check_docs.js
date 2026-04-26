const mongoose = require('mongoose');
const Document = require('./src/models/document.model');

async function checkDocs() {
  await mongoose.connect('mongodb://127.0.0.1:27017/docubrain');
  const docs = await Document.find({}).lean();
  console.log(JSON.stringify(docs, null, 2));
  await mongoose.disconnect();
}

checkDocs();
