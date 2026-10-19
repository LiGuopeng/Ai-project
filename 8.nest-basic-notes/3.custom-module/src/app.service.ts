import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DsService } from './ds/ds.service.js';

export interface Detail {
  name: string;
  age: string | null;
}

@Injectable()
export class AppService {
  constructor(private readonly dsService: DsService) {}

  async getHello(): Promise<Detail[]> {
    return this.findAllDetails();
  }

  async createDetail(name: string, age?: string): Promise<Detail> {
    const normalizedName = this.normalizeName(name);

    try {
      const result = await this.dsService.query<Detail>(
        'INSERT INTO details (name, age) VALUES ($1, $2) RETURNING name, age',
        [normalizedName, age ?? null],
      );

      return this.requireReturnedDetail(result.rows[0], '创建数据失败');
    } catch (error: unknown) {
      this.rethrowUniqueNameError(error, normalizedName);
    }
  }

  async findAllDetails(): Promise<Detail[]> {
    const result = await this.dsService.query<Detail>(
      'SELECT name, age FROM details ORDER BY name',
    );

    return result.rows;
  }

  async findDetail(name: string): Promise<Detail> {
    const normalizedName = this.normalizeName(name);
    const result = await this.dsService.query<Detail>(
      'SELECT name, age FROM details WHERE name = $1 LIMIT 1',
      [normalizedName],
    );

    const detail = result.rows[0];
    if (!detail) {
      throw new NotFoundException(`找不到 name=${normalizedName} 的数据`);
    }

    return detail;
  }

  async updateDetail(
    currentName: string,
    name: string,
    age?: string,
  ): Promise<Detail> {
    const normalizedCurrentName = this.normalizeName(currentName);
    const normalizedName = this.normalizeName(name);

    try {
      const result = await this.dsService.query<Detail>(
        'UPDATE details SET name = $1, age = $2 WHERE name = $3 RETURNING name, age',
        [normalizedName, age ?? null, normalizedCurrentName],
      );

      const detail = result.rows[0];
      if (!detail) {
        throw new NotFoundException(
          `找不到 name=${normalizedCurrentName} 的数据`,
        );
      }

      return detail;
    } catch (error: unknown) {
      this.rethrowUniqueNameError(error, normalizedName);
    }
  }

  async deleteDetail(name: string): Promise<Detail> {
    const normalizedName = this.normalizeName(name);
    const result = await this.dsService.query<Detail>(
      'DELETE FROM details WHERE name = $1 RETURNING name, age',
      [normalizedName],
    );

    const detail = result.rows[0];
    if (!detail) {
      throw new NotFoundException(`找不到 name=${normalizedName} 的数据`);
    }

    return detail;
  }

  private normalizeName(name: string): string {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestException('name 不能为空');
    }

    return name.trim();
  }

  private requireReturnedDetail(
    detail: Detail | undefined,
    message: string,
  ): Detail {
    if (!detail) {
      throw new InternalServerErrorException(message);
    }

    return detail;
  }

  private rethrowUniqueNameError(error: unknown, name: string): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw new ConflictException(`name=${name} 已存在`);
    }

    throw error;
  }
}
