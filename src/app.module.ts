import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { Auth } from './module/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';


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
      entities:[Auth],
      autoLoadEntities:true,
      synchronize:true
    }),
    AuthModule,
    ArticlesModule
  ],
  controllers: [],
  providers: [
     {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  ],
})
export class AppModule {}
