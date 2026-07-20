import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "auth", timestamps: true })
export class Auth extends Model {
  @Column({ allowNull: false })
  username!: string;

  @Column({ allowNull: false })
  email!: string;

  @Column({ allowNull: false })
  password!: string;

  @Column({ allowNull: true })
  code!: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  otpTime?: BigInt;
}
