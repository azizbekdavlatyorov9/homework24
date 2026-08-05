import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleImageDto } from './create-article-image.dto copy';

export class UpdateArticleImageDto extends PartialType(CreateArticleImageDto) {}
