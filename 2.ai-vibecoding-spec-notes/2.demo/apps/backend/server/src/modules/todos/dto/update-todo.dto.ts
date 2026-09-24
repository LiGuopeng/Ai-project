import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateTodoDto {
    @IsBoolean()
    @IsOptional()
    completed?: boolean

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    title?: string
}
