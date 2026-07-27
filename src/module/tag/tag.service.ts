import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

  async findOne(id: number):Promise<Tag> {
    const foundedTag = await this.tagRepo.findOne({
      where: {id},
      relations: {
        author:true
      }
    })

    if(!foundedTag) throw new NotFoundException("Tag not found")
    return foundedTag
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  async remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
