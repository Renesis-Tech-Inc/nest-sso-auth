import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/email.service';

import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [HttpModule, UserModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class CommonModule {}
