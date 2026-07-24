import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateAuthDto,
  CreateLoginDto,
  VerifyDto,
} from "./dto/create-auth.dto";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { describe } from "node:test";

@ApiInternalServerErrorResponse({ description: "Internal Server Error" })
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiUnauthorizedResponse({ description: "User already exist" })
  @ApiOkResponse({ description: "Registered" })
  @HttpCode(201)
  @Post("register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Invalid Password" })
  @ApiOkResponse({ description: "Please check your email" })
  @HttpCode(200)
  @Post("login")
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }

  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Code not found" })
  @ApiUnauthorizedResponse({ description: "Otp expired" })
  @ApiUnauthorizedResponse({ description: "Wrong Otp" })
  @HttpCode(200)
  @Post("verify")
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }
}
