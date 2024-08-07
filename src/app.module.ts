import { INestApplication, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(<string>process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // shouldn't be used in production - may lose data
    }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {
  static port: number | string;

  constructor(configService: ConfigService) {
    AppModule.port = configService.get<string>('PORT') || 8080;
  }

  static getBaseUrl(app: INestApplication): string {
    let baseUrl = app.getHttpServer().address().address;
    if (baseUrl == '0.0.0.0' || baseUrl == '::') {
        return (baseUrl = 'localhost');
    }
  }
}