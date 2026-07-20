import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
  @IsString({ message: "String typeda bo'lishi kerak" })
  @Length(3, 50)
  username!: string;
  @IsString()
  @IsEmail()
  @Length(12, 150)
  email!: string;

  @IsString()
  @Length(8, 200)
  password!: string;
}
