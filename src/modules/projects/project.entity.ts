// project.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from '../clients/client.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column('json')
  services_needed: string[];

  @Column()
  budget: number;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => Client, (client) => client.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' }) // 👈 Force snake_case
  client: Client;
}
