import { DynamicModule, Global, Module, type Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_MODULE_OPTIONS, PG_POOL } from './pg.constants.js';
import type { PgModuleAsyncOptions, PgModuleOptions } from './pg.interfaces.js';
import { PgService } from './pg.service.js';

const poolProvider: Provider = {
  provide: PG_POOL,
  inject: [PG_MODULE_OPTIONS],
  useFactory: (options: PgModuleOptions): Pool => {
    // slowQueryThresholdMs 是应用配置，不应传入 pg.Pool。
    const { slowQueryThresholdMs: _slowQueryThresholdMs, ...poolConfig } =
      options;
    return new Pool(poolConfig);
  },
};

@Global()
@Module({})
export class PgModule {
  // 配置已在代码中准备好时使用，例如测试模块。
  static forRoot(options: PgModuleOptions): DynamicModule {
    return this.createDynamicModule({
      provide: PG_MODULE_OPTIONS,
      useValue: options,
    });
  }

  // 配置来自 ConfigService 或远程密钥服务时使用，线上通常走这个入口。
  static forRootAsync(options: PgModuleAsyncOptions): DynamicModule {
    return this.createDynamicModule(
      {
        provide: PG_MODULE_OPTIONS,
        inject: options.inject ?? [],
        useFactory: options.useFactory,
      },
      options.imports,
    );
  }

  private static createDynamicModule(
    optionsProvider: Provider,
    imports: PgModuleAsyncOptions['imports'] = [],
  ): DynamicModule {
    return {
      module: PgModule,
      imports,
      providers: [optionsProvider, poolProvider, PgService],
      exports: [PgService],
    };
  }
}
