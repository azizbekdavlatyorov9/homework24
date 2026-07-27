import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateTagDto {
  @ApiProperty({default:"HTML"})
  @IsString()
  title!:string
}
