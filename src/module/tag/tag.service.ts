import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) {}
  async create(createTagDto: CreateTagDto, request: any) {
    const foundedTag = await this.tagRepo.findOne({
      where: { title: createTagDto.title },
    });

    if (foundedTag) throw new BadRequestException("Tag already exist");

    const tag = this.tagRepo.create({
      ...createTagDto,
      author: request["user"].id,
    });
    return await this.tagRepo.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
