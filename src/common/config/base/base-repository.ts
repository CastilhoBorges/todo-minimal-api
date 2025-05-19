import {
  EntityManager,
  ObjectLiteral,
  Repository,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  SaveOptions,
  DeepPartial,
} from 'typeorm';

type FindAndCount<Entity> = {
  result: Entity[];
  total: number;
};

export class BaseRepository<Entity extends ObjectLiteral> {
  protected repository: Repository<Entity>;

  constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  protected getRepository(entityManager?: EntityManager): Repository<Entity> {
    return entityManager
      ? entityManager.getRepository(this.repository.target)
      : this.repository;
  }

  async find(
    options?: FindManyOptions<Entity>,
    entityManager?: EntityManager,
  ): Promise<Entity[]> {
    const repository = this.getRepository(entityManager);
    return repository.find(options);
  }

  async findBy(
    where: FindOptionsWhere<Entity>,
    entityManager?: EntityManager,
  ): Promise<Entity[]> {
    const repository = this.getRepository(entityManager);
    return repository.findBy(where);
  }

  async findAndCount(
    options?: FindManyOptions<Entity>,
    entityManager?: EntityManager,
  ): Promise<FindAndCount<Entity>> {
    const repository = this.getRepository(entityManager);
    const [result, total] = await repository.findAndCount(options);
    return { result, total };
  }

  async findAndCountBy(
    where: FindOptionsWhere<Entity>,
    entityManager?: EntityManager,
  ): Promise<FindAndCount<Entity>> {
    const repository = this.getRepository(entityManager);
    const [result, total] = await repository.findAndCountBy(where);
    return { result, total };
  }

  async findOne(
    options?: FindOneOptions<Entity>,
    entityManager?: EntityManager,
  ): Promise<Entity | null> {
    const repository = this.getRepository(entityManager);
    return repository.findOne(options || {});
  }

  async findOneBy(
    where: FindOptionsWhere<Entity>,
    entityManager?: EntityManager,
  ): Promise<Entity | null> {
    const repository = this.getRepository(entityManager);
    return repository.findOneBy(where);
  }

  async save(
    entity: Entity,
    options?: SaveOptions,
    entityManager?: EntityManager,
  ): Promise<Entity | null> {
    const repository = this.getRepository(entityManager);
    return repository.save(entity, options);
  }

  async update<T extends DeepPartial<Entity>>(
    entity: T,
    manager?: EntityManager,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity>;

  async update<T extends DeepPartial<Entity>[]>(
    entity: T,
    manager?: EntityManager,
  ): Promise<Entity[]>;

  async update<T extends DeepPartial<Entity> | DeepPartial<Entity>[]>(
    entity: T,
    entityManager?: EntityManager,
    options?: FindManyOptions<Entity>,
  ) {
    const repository = this.getRepository(entityManager);

    if (options) {
      const entities = await repository.find(options);
      const entitiesMap = entities.map((item) => ({ ...item, ...entity }));
      await repository.save(entitiesMap as DeepPartial<Entity>[]);
      return entitiesMap;
    }

    return repository.save(entity as Entity);
  }

  async create<T extends DeepPartial<Entity>>(
    entity: T,
    entityManager?: EntityManager,
  ): Promise<Entity>;

  async create<T extends DeepPartial<Entity>[]>(
    entity: T,
    entityManager?: EntityManager,
  ): Promise<Entity[]>;

  async create<T extends DeepPartial<Entity> | DeepPartial<Entity>[]>(
    entity: T,
    entityManager?: EntityManager,
  ): Promise<Entity | Entity[]> {
    const repository = this.getRepository(entityManager);
    if (Array.isArray(entity)) {
      const entities = entity.map((entityCreate) =>
        repository.create(entityCreate as Entity),
      );

      return repository.save(entities);
    }

    const entityCreate = repository.create(entity as Entity);
    return repository.save(entityCreate);
  }

  async softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    entityManager?: EntityManager,
  ): Promise<Entity>;

  async softRemove<T extends DeepPartial<Entity[]>>(
    entity: T,
    entityManager?: EntityManager,
  ): Promise<Entity[]>;

  async softRemove<T extends DeepPartial<Entity> | DeepPartial<Entity>[]>(
    entity: T,
    entityManager?: EntityManager,
  ): Promise<Entity | Entity[]> {
    const repository = this.getRepository(entityManager);

    if (Array.isArray(entity)) {
      return repository.softRemove(entity as Entity[]);
    }

    return repository.softRemove(entity as Entity);
  }
}
