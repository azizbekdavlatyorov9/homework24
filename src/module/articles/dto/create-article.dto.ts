import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({default:"Javascript"})
  @IsString()
  title!: string;

  @ApiProperty({default:"The best programming language in the world"})
  @IsString()
  text!: string;
  
}
