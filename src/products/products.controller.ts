import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Res} from "../types";

@Controller('/product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Post('/add')
  create(@Body() createProductDto: CreateProductDto): Promise<Res> {
    return this.productsService.create(createProductDto);
  }

  @Get('/all')
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('/info/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('/update/:id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('/remove/:id')
  async remove(@Param('id') id: string) {
    return this.productsService.deleteById(id);
  }
}
