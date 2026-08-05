import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsNumber } from "class-validator";

export class CreateArticleImageDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({default:1})
  article!: number;


}
