import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, CreateLoginDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Auth } from './entities/auth.entity';
import * as  nodemailer from "nodemailer"
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth) private authModel: typeof Auth) { }

  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "azizbekdavlatyorov9@gmail.com",
      pass: process.env.GOOGLE_PASS
    }
  })
  async register(createAuthDto: CreateAuthDto): Promise<string> {
    const { username, email, password } = createAuthDto

    const foundedUser = await this.authModel.findOne({ where: { email } })

    if (foundedUser) throw new UnauthorizedException("User already exist")
    const randomCode = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("")

    const hashPassword = await bcrypt.hash(password, 12)

    await this.authModel.create({ username, email, password: hashPassword, code: randomCode, otpTime: Date.now() + 120000 })

    await this.transporter.sendMail({
      from: "azizbekdavlatyorov9@gmail.com",
      to: email,
      subject: "Lesson",
      text: `${randomCode}`
    })

    return "Registered"
  }

  async login(createLoginDto: CreateLoginDto): Promise<string> {
    const { email, password } = createLoginDto

    const foundedUser = await this.authModel.findOne({ where: { email } })

    if (!foundedUser) throw new NotFoundException("User not found")
    const randomCode = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("")

    const compare = await bcrypt.compare(password, foundedUser.password)

    if (compare) {
    await this.authModel.update({code: randomCode, otpTime: Date.now() + 120000}, {where:{ email }})

      await this.transporter.sendMail({
        from: "azizbekdavlatyorov9@gmail.com",
        to: email,
        subject: "Lesson",
        text: `${randomCode}`
      })
      return "Please check your email"
    } else {
      throw new UnauthorizedException("Invalid Password")
    }

  }
}