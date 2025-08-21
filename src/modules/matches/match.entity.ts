import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Vendor } from '../vendors/vendor.entity';

@Entity({ name: 'matches' })
@Unique(['project', 'vendor'])
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { eager: true, onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => Vendor, { eager: true, onDelete: 'CASCADE' })
  vendor: Vendor;

  @Column({ type: 'float' })
  score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
