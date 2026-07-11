import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedAtToKeyRecords1752000000002
  implements MigrationInterface
{
  name = 'AddDeletedAtToKeyRecords1752000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'key_records',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('key_records', 'deleted_at');
  }
}