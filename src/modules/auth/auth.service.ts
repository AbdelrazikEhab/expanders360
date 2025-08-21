import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Client } from '../clients/client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Client) private clients: Repository<Client>,
    private jwt: JwtService,
  ) {}

  async registerClient(email: string, password: string, company_name: string) {
    const exists = await this.users.findOne({ where: { email } });
    if (exists) throw new UnauthorizedException('Email already registered');
    const client = await this.clients.save(this.clients.create({
      company_name, contact_email: email
    }));
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.save(this.users.create({
      email, passwordHash, role: 'client', client
    }));
    return this.sign(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email }, relations: ['client'] });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user);
  }

  private sign(user: User) {
    const payload: any = { sub: user.id, email: user.email, role: user.role };
    if (user.role === 'client' && (user.client as any)?.id) {
      payload.clientId = (user.client as any).id;
    }
    return {
      access_token: this.jwt.sign(payload),
      user: payload,
    };
  }
}
