import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'

import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodoService } from './todo.service'

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Delete('completed')
    clearCompleted() {
        return this.todoService.clearCompleted()
    }

    @Get()
    findAll() {
        return this.todoService.findAll()
    }

    @Post()
    create(@Body() dto: CreateTodoDto) {
        return this.todoService.create(dto.title)
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTodoDto) {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('至少提供一个需要更新的字段')
        }

        return this.todoService.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.todoService.remove(id)
    }
}
