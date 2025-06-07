"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FScoreService = void 0;
const fscore_repository_1 = require("../repositories/fscore.repository");
class FScoreService {
    fscoreRepository;
    constructor() {
        this.fscoreRepository = new fscore_repository_1.FScoreRepository();
    }
    /**
     * Get FScore by ID
     */
    async getById(id) {
        return this.fscoreRepository.findById(id);
    }
    /**
     * Get FScore by symbol
     */
    async getBySymbol(symbol) {
        return this.fscoreRepository.findBySymbol(symbol);
    }
    /**
     * Get all FScores
     */
    async getAll() {
        return this.fscoreRepository.findAll();
    }
    /**
     * Create a new FScore
     */
    async create(data) {
        return this.fscoreRepository.create(data);
    }
    /**
     * Update FScore by ID
     */
    async update(id, data) {
        return this.fscoreRepository.update(id, data);
    }
    /**
     * Update FScore by symbol
     */
    async updateBySymbol(symbol, data) {
        return this.fscoreRepository.updateBySymbol(symbol, data);
    }
    /**
     * Delete FScore by ID
     */
    async delete(id) {
        return this.fscoreRepository.delete(id);
    }
    /**
     * Delete FScore by symbol
     */
    async deleteBySymbol(symbol) {
        return this.fscoreRepository.deleteBySymbol(symbol);
    }
    /**
     * Create or update FScore by symbol
     */
    async upsert(symbol, data) {
        return this.fscoreRepository.upsert(symbol, data);
    }
}
exports.FScoreService = FScoreService;
