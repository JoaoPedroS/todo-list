import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUUID,
  ArrayUnique,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  @ArrayUnique()
  dependencyIds?: string[];
}
