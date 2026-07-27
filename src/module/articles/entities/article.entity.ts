import { BaseEntity } from "src/database/entities/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Tag } from "src/module/tag/entities/tag.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: "article" })
export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column()
  text!: string;

  @Column({ nullable: true })
  backgroundImage!: string;

  //relations
  @ManyToOne(() => Auth, (user) => user.articles)
  @JoinColumn({name:"auth_id"})
  author!: Auth;

  @OneToMany(() => Tag, (tag) => tag.articles)
  @JoinColumn({name:"tag_id"})
  tags!: Tag[];
}
