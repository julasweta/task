import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CustomConfigModule } from './config/config.module';
import { CustomConfigService } from './config/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CustomConfigModule,
    MongooseModule.forRootAsync({
      imports: [CustomConfigModule],
      useFactory: (customConfigService: CustomConfigService) => ({
        uri: customConfigService.db_host,
      }),
      inject: [CustomConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAILER_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAILER_EMAIL,
          pass: process.env.EMAILER_PASSWORD,
        },
        ignoreTLS: true,
      },
      template: {
        dir: './src/email_templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      defaults: {
        from: '"no-reply" <julasweta@ukr.net>',
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
