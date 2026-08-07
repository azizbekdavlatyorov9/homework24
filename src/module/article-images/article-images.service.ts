import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateArticleImageDto } from "./dto/update-article-image.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleImage } from "./entities/article-image.entity";
import { Repository } from "typeorm";
import { CreateArticleImageDto } from "./dto/create-article-image.dto copy";
import { Article } from "../articles/entities/article.entity";

@Injectable()
export class ArticleImagesService {
  constructor(
    @InjectRepository(ArticleImage)
    private articleImageRepo: Repository<ArticleImage>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}
  async create(
    createArticleImageDto: CreateArticleImageDto,
    file: Express.Multer.File[],
  ) {
    let foundedArticles = await this.articleImageRepo.find({
      where: { article: { id: createArticleImageDto.article } },
    });

    if (foundedArticles.length + file.length > 10)
      throw new BadRequestException("Limit has been exceeded");

    let order = foundedArticles.length + 1;

    const result: any = [];

    for (const element of file) {
      const articleDetails = this.articleImageRepo.create({
        article: { id: createArticleImageDto.article },
      });

      articleDetails.sortOrder = order;
      articleDetails.url = `http://localhost:4001/uploads/${element.filename}`;
      order++;
      result.push(articleDetails)
      await this.articleImageRepo.save(articleDetails);
    }

    return result;
  }

  async findAll() {
    return await this.articleImageRepo.find()
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} articleImage`;
  // }

  // update(id: number, updateArticleImageDto: UpdateArticleImageDto) {
  //   return `This action updates a #${id} articleImage`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} articleImage`;
  // }
}
