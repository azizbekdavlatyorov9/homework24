import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
  @ApiProperty({ default: "Azizbek" })
  @IsString({ message: "String typeda bo'lishi kerak" })
  @Length(3, 50)
  username!: string;

  @ApiProperty({ default: "azizbekdavlatyorov9@gmail.com" })
  @IsString()
  @IsEmail()
  @Length(12, 150)
  email!: string;

  @ApiProperty({ default: "azizbek98" })
  @IsString()
  @Length(8, 200)
  password!: string;
}

export class CreateLoginDto {  
  @ApiProperty({ default: "azizbekdavlatyorov9@gmail.com" })
  @IsString()
  @IsEmail()
  @Length(12, 150)
  email!: string;

  @ApiProperty({ default: "azizbek98" })
  @IsString()
  @Length(8, 200)
  password!: string;
}

export class VerifyDto {
  @ApiProperty({ default: "azizbekdavlatyorov9@gmail.com" })
  @IsString()
  @IsEmail()
  @Length(12, 150)
  email!: string;

  @ApiProperty({ default: "123456" })
  @IsString()
  @Length(6, 6)
  code!: string;
}
