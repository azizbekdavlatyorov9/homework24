import { BaseEntity } from "src/database/entities/base.entity";
import { Article } from "src/module/articles/entities/article.entity";
import { Column, Entity, JoinColumn,  ManyToOne,  } from "typeorm";

@Entity({name:"article_image"})
export class ArticleImage extends BaseEntity {

  @Column()
  sortOrder!: number

  @Column()
  url!:string

  @ManyToOne(() => Article, (article) => article.articleImages, {cascade:true} )
  @JoinColumn({name: "article_Id"})
  article!: Article;
}
