import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from '../../modules/clients/client.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })   // ← Map camelCase property to snake_case column
  passwordHash: string;

  @Column({ type: 'enum', enum: ['admin', 'client'] })
  role: 'admin' | 'client';

  @ManyToOne(() => Client, client => client.users, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
