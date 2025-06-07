import { FScoreRepository, IFScore, IFScoreCreate, IFScoreUpdate } from '../repositories/fscore.repository';

export class FScoreService {
  private fscoreRepository: FScoreRepository;

  constructor() {
    this.fscoreRepository = new FScoreRepository();
  }

  /**
   * Get FScore by ID
   */
  async getById(id: string): Promise<IFScore | null> {
    return this.fscoreRepository.findById(id);
  }

  /**
   * Get FScore by symbol
   */
  async getBySymbol(symbol: string): Promise<IFScore | null> {
    return this.fscoreRepository.findBySymbol(symbol);
  }

  /**
   * Get all FScores
   */
  async getAll(): Promise<IFScore[]> {
    return this.fscoreRepository.findAll();
  }

  /**
   * Create a new FScore
   */
  async create(data: IFScoreCreate): Promise<IFScore> {
    return this.fscoreRepository.create(data);
  }

  /**
   * Update FScore by ID
   */
  async update(id: string, data: IFScoreUpdate): Promise<IFScore> {
    return this.fscoreRepository.update(id, data);
  }

  /**
   * Update FScore by symbol
   */
  async updateBySymbol(symbol: string, data: IFScoreUpdate): Promise<IFScore> {
    return this.fscoreRepository.updateBySymbol(symbol, data);
  }

  /**
   * Delete FScore by ID
   */
  async delete(id: string): Promise<IFScore> {
    return this.fscoreRepository.delete(id);
  }

  /**
   * Delete FScore by symbol
   */
  async deleteBySymbol(symbol: string): Promise<IFScore> {
    return this.fscoreRepository.deleteBySymbol(symbol);
  }

  /**
   * Create or update FScore by symbol
   */
  async upsert(symbol: string, data: IFScoreCreate): Promise<IFScore> {
    return this.fscoreRepository.upsert(symbol, data);
  }
} 