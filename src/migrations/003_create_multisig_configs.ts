import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMultisigConfigs1752000000003
  implements MigrationInterface
{
  name = 'CreateMultisigConfigs1752000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'multisig_configs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'account_id', type: 'varchar', length: '56' },
          { name: 'owner_id', type: 'varchar', length: '255' },
          { name: 'master_weight', type: 'int' },
          { name: 'low_threshold', type: 'int' },
          { name: 'med_threshold', type: 'int' },
          { name: 'high_threshold', type: 'int' },
          { name: 'signers', type: 'jsonb' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'multisig_configs',
      new TableIndex({
        name: 'idx_multisig_configs_account_id',
        columnNames: ['account_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'multisig_configs',
      new TableIndex({
        name: 'idx_multisig_configs_owner_id',
        columnNames: ['owner_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'multisig_configs',
      'idx_multisig_configs_owner_id',
    );
    await queryRunner.dropIndex(
      'multisig_configs',
      'idx_multisig_configs_account_id',
    );
    await queryRunner.dropTable('multisig_configs');
  }
}