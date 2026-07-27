import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { In, Repository } from "typeorm";
import { CreateArticleFileDto } from "./dto/create-article-file-dto";
import { Tag } from "../tag/entities/tag.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private TagRepo: Repository<Tag>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
    request: any,
  ) {
    const article = this.articleRepo.create({
      title: createArticleDto.title,
      text: createArticleDto.text,
    });

    const foundedTag = await this.TagRepo.findBy({
      id: In(createArticleDto.tags),
    });

    article.backgroundImage = `http://localhost:4001/uploads/${file.filename}`;
    article.author = request.user.id;
    article.tags = foundedTag;
    return await this.articleRepo.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepo.find({
      relations: {
        author: true,
        tags: true,
      },
    });
  }

  async findOne(id: number): Promise<Article> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article Not Found");
    return foundedArticle;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<string> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article Not Found");

    foundedArticle.title = updateArticleDto.title ?? foundedArticle.title;
    foundedArticle.text = updateArticleDto.text ?? foundedArticle.text;

    if (updateArticleDto.tags) {
      foundedArticle.tags = updateArticleDto.tags.map((id) => ({ id }) as Tag);
    }

    await this.articleRepo.save(foundedArticle)
    return "Updated Article";
  }

  async remove(id: number): Promise<string> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article Not Found");

    await this.articleRepo.softDelete(id);
    return "Deleted Article";
  }
}
