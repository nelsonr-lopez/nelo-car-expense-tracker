import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from '../../dto/create-expense.dto';
import { Expense } from '../../entities/expense.entity';

@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({
    status: 200,
    description: 'Return all expenses',
    type: [Expense],
  })
  findAll(): Promise<Expense[]> {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the expense',
    type: Expense,
  })
  findOne(@Param('id') id: string): Promise<Expense> {
    return this.expensesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'The expense has been successfully created',
    type: Expense,
  })
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.create(createExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully deleted',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.expensesService.remove(+id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get expense summary' })
  @ApiResponse({ status: 200, description: 'Return expense summary' })
  getSummary(@Query('month') month?: string) {
    return this.expensesService.getSummary(month);
  }
}
