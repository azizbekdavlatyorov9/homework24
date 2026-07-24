  import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/common/enums/user-role";
  import { BaseEntity } from "src/database/entities/base.entity";
  import {  Column, Entity } from "typeorm";

  @Entity({ name: "auth" })
  export class Auth extends BaseEntity {
    @ApiProperty()
    @Column({ nullable: false })
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({type: "enum", enum:UserRole, default: UserRole.USER})
    role!:UserRole

    @Column({ nullable: true })
    code!: string;

    @Column({ nullable: true, type: "bigint" })
    otpTime?: number;

  }
