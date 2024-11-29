import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = ``;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: './verification',
      context: {
        email,
        verificationUrl,
      },
    });
  }
}
