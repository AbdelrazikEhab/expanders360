import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1710000000000 implements MigrationInterface {
    name = 'InitSchema1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS clients (
          id INT PRIMARY KEY AUTO_INCREMENT,
          company_name VARCHAR(255) NOT NULL,
          contact_email VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          passwordHash VARCHAR(255) NOT NULL,
          role ENUM('admin','client') NOT NULL DEFAULT 'client',
          clientId INT NULL,
          CONSTRAINT fk_user_client FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS projects (
          id INT PRIMARY KEY AUTO_INCREMENT,
          clientId INT NOT NULL,
          country VARCHAR(100) NOT NULL,
          services_needed JSON NOT NULL,
          budget DECIMAL(12,2) NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_project_client FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS vendors (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          countries_supported JSON NOT NULL,
          services_offered JSON NOT NULL,
          rating FLOAT NOT NULL DEFAULT 0,
          response_sla_hours INT NOT NULL DEFAULT 72,
          sla_expires_at DATETIME NULL,
          sla_expired BOOLEAN NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS matches (
          id INT PRIMARY KEY AUTO_INCREMENT,
          projectId INT NOT NULL,
          vendorId INT NOT NULL,
          score FLOAT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_project_vendor (projectId, vendorId),
          CONSTRAINT fk_match_project FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
          CONSTRAINT fk_match_vendor FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS matches`);
        await queryRunner.query(`DROP TABLE IF EXISTS vendors`);
        await queryRunner.query(`DROP TABLE IF EXISTS projects`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
        await queryRunner.query(`DROP TABLE IF EXISTS clients`);
    }
}
