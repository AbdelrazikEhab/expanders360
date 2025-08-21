import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'vendors' })
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'json' })
  countries_supported: string[];

  @Column({ type: 'json' })
  services_offered: string[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 72 })
  response_sla_hours: number;

  @Column({ type: 'datetime', nullable: true })
  sla_expires_at: Date | null;

  @Column({ type: 'boolean', default: false })
  sla_expired: boolean;
}
