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
  @IsNotEmpty({ message: 'o titulo do item é obrigatório' })
  title: string;

  @IsDateString()
  @IsNotEmpty({ message: 'a data do item é obrigatória' })
  date: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  @ArrayUnique()
  dependencyIds?: string[];
}
