import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUUID,
  ArrayUnique,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsNotEmpty()
  @IsUUID('4', { each: true })
  @ArrayUnique()
  id: string;
}
