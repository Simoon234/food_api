import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product} from './entities/product.entity';
import {AllProducts, Res, ResSingleProduct} from "../types";

@Injectable()
export class ProductsService {
  async create({
                 productCategory,
                 productImage,
                 productName,
                 productPrice,
                 productQuantity
               }: CreateProductDto): Promise<Res> {
    const insertProduct = new Product();
    insertProduct.productName = productName;
    insertProduct.productPrice = productPrice;
    insertProduct.productImage = productImage;
    insertProduct.productCategory = productCategory;
    insertProduct.productQuantity = productQuantity;

    if (insertProduct.productQuantity <= 0) {
      throw new HttpException(`Product quantity can not be less/equal then 0`, HttpStatus.BAD_REQUEST);
    }

    if (productPrice <= 0) {
      throw new HttpException(`Product price can not be less then 0`, HttpStatus.BAD_REQUEST);
    }

    const findProduct = await Product.find();

    findProduct.find((pro) => {
      console.log(pro)
      if (pro.productName === productName) {
        throw new HttpException(`Sorry but you already have a product with this name (${productName})`, HttpStatus.BAD_REQUEST);
      }
    })

    await insertProduct.save();

    return {
      status: true,
    }

  }

  async getAllProducts(): Promise<AllProducts> {
    const allProducts = await Product.find();

    if (allProducts.length <= 0) {
      return {
        message: 'No products found',
        status: false
      }
    }

    return {
      allProducts,
      status: true
    }
  }

  async findOne(id: string): Promise<ResSingleProduct> {
    const singleProduct = await Product.findOne({where: {id}});
    return {
      status: singleProduct !== null,
      singleProduct: singleProduct ?? 'No product found'
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async deleteById(id: string): Promise<Res> {
    const removeProduct = await Product.createQueryBuilder()
        .delete()
        .from(Product)
        .where("id = :id", {id})
        .execute();

    if (removeProduct.affected < 1) {
      throw new HttpException(`Sorry, there was an error deleting the product. No product with that (${id}) id.`, HttpStatus.BAD_REQUEST);
    }

    return {
      status: true
    }
  }
}
