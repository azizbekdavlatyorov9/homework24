import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Auth } from './entities/auth.entity';
import * as  nodemailer from "nodemailer"
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth) private authModel: typeof Auth){}

  private transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "muhammadalishuhratjonov50@gmail.com",
      pass:process.env.GOOGLE_PASS
    }
  })
  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password} = createAuthDto

    const foundedUser = await this.authModel.findOne({where: {email}})

    if(foundedUser) throw new NotFoundException("User already exist")
      const randomCode = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join("")

    const hashPassword

    await this.authModel.create({username, email, password})

    return randomCode
  }
}