// Purpose: Generic Data Access Layer (DAL) Abstract Base Repository
// Path: backend/src/repositories/BaseRepository.js

/**
 * Base Repository implementing standard CRUD operations and query helpers.
 */
class BaseRepository {
  /**
   * @param {import('mongoose').Model} model - Mongoose Schema Model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Creates a new document
   * @param {Object} payload - Document attributes
   * @param {Object} [options] - Mongoose write options (e.g., session)
   */
  async create(payload, options = {}) {
    const docs = await this.model.create([payload], options);
    return docs[0];
  }

  /**
   * Finds a document by ID (automatically filters soft-deleted records)
   * @param {string} id - Document ObjectId
   * @param {string|Object} [select] - Fields to select or exclude
   * @param {Object} [options] - Query execution options
   */
  async findById(id, select = '', options = {}) {
    const query = this.model.findOne({ _id: id, isDeleted: { $ne: true } }, select, options);
    return await query.exec();
  }

  /**
   * Finds a single document matching query criteria
   * @param {Object} filter - Mongoose filter query
   * @param {string|Object} [select] - Fields projection
   * @param {Object} [options] - Options like populate, lean
   */
  async findOne(filter = {}, select = '', options = {}) {
    const query = this.model.findOne({ isDeleted: { $ne: true }, ...filter }, select, options);
    return await query.exec();
  }

  /**
   * Finds multiple documents matching criteria
   * @param {Object} filter - Mongoose filter query
   * @param {string|Object} [select] - Fields projection
   * @param {Object} [options] - Query options (sort, limit, skip, populate, lean)
   */
  async find(filter = {}, select = '', options = {}) {
    const query = this.model.find({ isDeleted: { $ne: true }, ...filter }, select, options);
    return await query.exec();
  }

  /**
   * Updates a document by ID
   * @param {string} id - Document ObjectId
   * @param {Object} updateData - Update mutations
   * @param {Object} [options] - Options (new, runValidators, session)
   */
  async updateById(id, updateData, options = { new: true, runValidators: true }) {
    return await this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: updateData },
      options
    ).exec();
  }

  /**
   * Soft-deletes a document by setting isDeleted: true and deletedAt
   * @param {string} id - Document ObjectId
   * @param {Object} [options] - Write options
   */
  async softDelete(id, options = { new: true }) {
    return await this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      options
    ).exec();
  }

  /**
   * Hard-deletes a document permanently from MongoDB
   * @param {string} id - Document ObjectId
   */
  async hardDelete(id) {
    return await this.model.findOneAndDelete({ _id: id }).exec();
  }

  /**
   * Paginated find helper
   * @param {Object} filter - Search filter query
   * @param {number} page - Current page index (1-based)
   * @param {number} limit - Items per page
   * @param {Object|string} sort - Sort order options
   * @param {string} select - Projection string
   * @param {Array|Object} populate - Population options
   */
  async findPaginated({ filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }, select = '', populate = '' }) {
    const skip = (page - 1) * limit;
    const finalFilter = { isDeleted: { $ne: true }, ...filter };

    let query = this.model.find(finalFilter).select(select).sort(sort).skip(skip).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    const [docs, totalDocs] = await Promise.all([
      query.exec(),
      this.model.countDocuments(finalFilter)
    ]);

    return { docs, totalDocs };
  }
}

module.exports = BaseRepository;