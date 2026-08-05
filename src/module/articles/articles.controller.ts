import { QueryDto } from './dto/query.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/user-role";
import { RolesGuard } from "src/common/guards/roles.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CreateArticleFileDto } from "./dto/create-article-file-dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {diskStorage} from "multer"
import * as path from "path"

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal Server Error" })
@UseGuards(AuthGuard)
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOkResponse({ type: CreateArticleDto })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiConsumes("multipart/form-data")
  @ApiBody({type: CreateArticleFileDto})
  @HttpCode(201)
  @Post("create_article")
  @UseInterceptors(
    FileInterceptor("backgroundImage", {
      storage:diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename:(req, file, cb) => {
          const uniqueSuffix = `${file.fieldname}${Date.now()}`
          const ext = path.extname(file.originalname)

          cb(null, `${uniqueSuffix}${ext  }`)
        }
      })
    })
  )
  create(@Body() createArticleDto: CreateArticleFileDto, @UploadedFile() file:Express.Multer.File, @Req() request:any) {
    return this.articlesService.create(createArticleDto, file, request);
  }

  @ApiOkResponse({ type: CreateArticleDto })
  @HttpCode(200)
  @Get("get_all_articles")
  findAll(@Query() queryDto:QueryDto) {
    return this.articlesService.findAll(queryDto);
  }

  @ApiNotFoundResponse({ description: "Article Not Found" })
  @HttpCode(200)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articlesService.findOne(+id);
  }

  @ApiNotFoundResponse({ description: "Article Not Found" })
  @ApiOkResponse({ description: "Updated Article" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiNotFoundResponse({ description: "Article Not Found" })
  @ApiOkResponse({ description: "Deleted Article" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articlesService.remove(+id);
  }
}
