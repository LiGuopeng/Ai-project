import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { QueryResult } from 'pg';
import { AppService, type Detail } from './app.service.js';
import type { DsService } from './ds/ds.service.js';

describe('AppService', () => {
  const query = vi.fn();
  const service = new AppService({ query } as unknown as DsService);

  beforeEach(() => {
    query.mockReset();
  });

  it('normalizes a name before creating a detail', async () => {
    const detail = { name: 'Alice', age: '18' };
    query.mockResolvedValue(queryResult([detail]));

    await expect(service.createDetail('  Alice  ', '18')).resolves.toEqual(
      detail,
    );
    expect(query).toHaveBeenCalledWith(expect.any(String), ['Alice', '18']);
  });

  it('rejects an empty name', async () => {
    await expect(service.findDetail('   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(query).not.toHaveBeenCalled();
  });

  it('returns 404 when a detail does not exist', async () => {
    query.mockResolvedValue(queryResult([]));

    await expect(service.findDetail('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('normalizes the lookup name when updating', async () => {
    const detail = { name: 'Bob', age: null };
    query.mockResolvedValue(queryResult([detail]));

    await expect(service.updateDetail(' Alice ', ' Bob ')).resolves.toEqual(
      detail,
    );
    expect(query).toHaveBeenCalledWith(expect.any(String), [
      'Bob',
      null,
      'Alice',
    ]);
  });

  it('normalizes the name when deleting', async () => {
    const detail = { name: 'Alice', age: '18' };
    query.mockResolvedValue(queryResult([detail]));

    await expect(service.deleteDetail(' Alice ')).resolves.toEqual(detail);
    expect(query).toHaveBeenCalledWith(expect.any(String), ['Alice']);
  });

  it('returns 409 for a duplicate name', async () => {
    query.mockRejectedValue({ code: '23505' });

    await expect(service.createDetail('Alice')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});

function queryResult(rows: Detail[]): QueryResult<Detail> {
  return {
    command: 'SELECT',
    rowCount: rows.length,
    oid: 0,
    fields: [],
    rows,
  };
}
