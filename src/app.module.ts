import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { Auth } from './module/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './module/articles/entities/article.entity';
import { ArticlesModule } from './module/articles/articles.module';


@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:".env", isGlobal:true}),
    TypeOrmModule.forRoot({
      type:"postgres",
      host:"localhost",
      username:"postgres",
      port:5432,
      database:process.env.DB_NAME,
      password:process.env.DB_PASSWORD,
      entities:[Auth, Article],
      autoLoadEntities:true,
      synchronize:true
    }),
    AuthModule,
    ArticlesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
