import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";
import { Tag } from "./entities/tag.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
