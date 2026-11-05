import { injectable } from 'inversify';
import { IMailProvider, Mail } from './IMailProvider';

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(mail: Mail): Promise<string | null> {
    console.log('=== E-mail de teste ===');
    console.log(mail);

    return null;
  }
}