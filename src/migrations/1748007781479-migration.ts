import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748007781479 implements MigrationInterface {
  name = 'Migration1748007781479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_status_enum" AS ENUM('done', 'todo', 'overdue')`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "description" text NOT NULL, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "status" "public"."task_status_enum" NOT NULL DEFAULT 'todo', "user_id" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
  }
}
