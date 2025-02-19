import { IsEmail, IsString } from "class-validator";

export class NotifyEmailDto {
  @IsEmail()
  email: string;

  @IsEmail()
  text: string;
}
