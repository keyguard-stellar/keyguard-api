import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateKeyRecords1752000000001 implements MigrationInterface {
  name = 'CreateKeyRecords1752000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // gen_random_uuid() requires the pgcrypto extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await queryRunner.createTable(
      new Table({
        name: 'key_records',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'label', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'public_key',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'owner_id',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'key_records',
      new TableIndex({
        name: 'idx_key_records_public_key',
        columnNames: ['public_key'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'key_records',
      new TableIndex({
        name: 'idx_key_records_owner_id',
        columnNames: ['owner_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('key_records', 'idx_key_records_owner_id');
    await queryRunner.dropIndex('key_records', 'idx_key_records_public_key');
    await queryRunner.dropTable('key_records');
  }
}