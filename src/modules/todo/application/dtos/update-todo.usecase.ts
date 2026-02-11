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

  @IsNotEmpty({ message: 'o id do item é obrigatório' })
  @IsUUID('4', { each: true })
  @ArrayUnique()
  id: string;
}
