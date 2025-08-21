import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Project } from '../projects/project.entity';
import { Vendor } from '../vendors/vendor.entity';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter | null = null;
  private from = process.env.SMTP_FROM || 'no-reply@expanders360.com';

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = +(process.env.SMTP_PORT || 0);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host, port, secure: port === 465, auth: { user, pass }
      });
    }
  }

  async onNewMatch(project: Project, vendor: Vendor, score: number) {
    const subject = `New match for project #${project.id}: ${vendor.name} (score ${score.toFixed(2)})`;
    const text = `Project ${project.id} in ${project.country} matched with ${vendor.name} (score=${score}).`;
    if (this.transporter) {
      await this.transporter.sendMail({
        from: this.from,
        to: project.client?.contact_email || 'ops@expanders360.com',
        subject, text
      });
    } else {
      console.log('[MAIL:MOCK]', subject, text);
    }
  }
}
