// src/typeorm.config.ts
import { DataSource } from "typeorm";
import { User } from "./modules/auth/user.entity";
import { Project } from "./modules/projects/project.entity";
import { Client } from "./modules/clients/client.entity";
import { Vendor } from "./modules/vendors/vendor.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  database: process.env.DB_NAME|| 'expanders360',
  entities: [User, Project, Client, Vendor],
  migrations: ["src/migrations/*.ts"], // <-- point to your migrations folder
  synchronize: false,
  logging: true,
});

export default AppDataSource;
