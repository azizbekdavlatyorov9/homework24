import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Auth } from "./entities/auth.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt-strategy";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("SECRET_KEY"),
        signOptions: { expiresIn: "6000s" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
