import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpenseService } from '../services/expense.service';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFiltersDto,
} from '../dto/expense.dto';
import { Expense } from '../entities/expense.entity';

@ApiTags('expenses')
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'The expense has been successfully created.',
    type: Expense,
  })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all expenses that match the filters.',
    type: [Expense],
  })
  findAll(@Query() filters: ExpenseFiltersDto) {
    return this.expenseService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the expense.',
    type: Expense,
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully updated.',
    type: Expense,
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.remove(id);
  }
}
