import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';

import { envValidationSchema } from './config/env.validation';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';

@Controller('health')
class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  async check() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),

    TerminusModule,
    AuthModule,
  ],

  controllers: [HealthController],
})
export class AppModule {}
