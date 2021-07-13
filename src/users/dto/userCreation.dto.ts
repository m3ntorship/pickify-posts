import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreationDto {
  @IsString()
  name: string;

  @IsString()
  profile_pic: string;

  @IsString()
  user_id: string;
}
