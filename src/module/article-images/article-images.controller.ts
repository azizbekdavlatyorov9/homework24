import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  Req,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ArticleImagesService } from "./article-images.service";
import { UpdateArticleImageDto } from "./dto/update-article-image.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CreateArticleDto } from "../articles/dto/create-article.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/user-role";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { CreateArticleImageFileDto } from "./dto/create-article-image.file.dto";
import { CreateArticleImageDto } from "./dto/create-article-image.dto copy";

@Controller("article-images")
@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal Server Error" })
@UseGuards(AuthGuard)
export class ArticleImagesController {
  constructor(private readonly articleImagesService: ArticleImagesService) {}

  @ApiOkResponse({ type: CreateArticleImageFileDto })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateArticleImageFileDto })
  @HttpCode(201)
  @Post("create_article")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${file.fieldname}${Date.now()}`;
          const ext = path.extname(file.originalname);

          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createArticleImageDto: CreateArticleImageDto,
    @UploadedFiles() file: Express.Multer.File[],
    
  ) {
    return this.articleImagesService.create(
      createArticleImageDto,
      file,
    );
  }

  // @Get()
  // findAll() {
  //   return this.articleImagesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.articleImagesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleImageDto: UpdateArticleImageDto) {
  //   return this.articleImagesService.update(+id, updateArticleImageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.articleImagesService.remove(+id);
  // }
}
