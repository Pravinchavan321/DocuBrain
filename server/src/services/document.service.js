const Document = require('../models/document.model');

class DocumentService {
  async createDocument(data) {
    try {
      const doc = new Document(data);
      return await doc.save();
    } catch (error) {
      throw error;
    }
  }

  async getDocuments({ page = 1, limit = 10, ...filters }) {
    try {
      const skip = (page - 1) * limit;
      const documents = await Document.find(filters)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      
      const total = await Document.countDocuments(filters);
      
      return {
        documents,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getDocumentById(id) {
    try {
      return await Document.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateIngestionState(id, data) {
    try {
      return await Document.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateDocumentStatus(id, status) {
    try {
      return await Document.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteDocument(id) {
    try {
      return await Document.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DocumentService();
