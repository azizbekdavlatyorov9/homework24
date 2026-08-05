import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { In, Repository } from "typeorm";
import { CreateArticleFileDto } from "./dto/create-article-file-dto";
import { Tag } from "../tag/entities/tag.entity";
import { QueryDto } from "./dto/query.dto";

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

  async findAll(queryDto: QueryDto) {
    const { page = 1, limit = 10, search } = queryDto;

    const myQuery = this.articleRepo
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.tags", "tags")
      .where(`article.deletedAt is null `);

    if (search) {
      myQuery.andWhere(
        `(article.title ILIKE :search
    OR article.text ILIKE :search
    OR tags.title ILIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    const total = await myQuery.getCount();

    const result = await myQuery
      .orderBy("article.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      result,
    };
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

    await this.articleRepo.save(foundedArticle);
    return "Updated Article";
  }

  async remove(id: number): Promise<string> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article Not Found");

    await this.articleRepo.softDelete(id);
    return "Deleted Article";
  }
}
function getMany() {
  throw new Error("Function not implemented.");
}
