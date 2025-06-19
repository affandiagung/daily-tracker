import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TargetModule } from './target/target.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, TargetModule, MemberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
