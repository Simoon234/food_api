import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { AllProducts, Res, ResSingleProduct } from "../types";

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
      throw new HttpException(
        `Product quantity can not be less/equal then 0`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (productPrice <= 0) {
      throw new HttpException(
        `Product price can not be less then 0`,
        HttpStatus.BAD_REQUEST
      );
    }

    const findProduct = await Product.find();

    findProduct.find((pro) => {
      if (pro.productName === productName) {
        throw new HttpException(
          `Sorry but you already have a product with this name (${productName})`,
          HttpStatus.BAD_REQUEST
        );
      }
    });

    await insertProduct.save();

    return {
      status: true
    };
  }

  async getAllProducts(): Promise<AllProducts> {
    const allProducts = await Product.find();

    if (allProducts.length <= 0) {
      return {
        message: "No products found",
        status: false
      };
    }

    return {
      allProducts,
      status: true
    };
  }

  async findOne(id: string): Promise<ResSingleProduct> {
    const singleProduct = await Product.findOne({ where: { id } });
    return {
      status: singleProduct !== null,
      singleProduct: singleProduct ?? "No product found"
    };
  }

  async updateProduct(
    id: string,
    {
      productImage,
      productName,
      productPrice,
      productQuantity
    }: UpdateProductDto
  ): Promise<Res> {
    const product = await Product.findOne({ where: { id } });
    product.productName = productName;
    product.productQuantity = productQuantity;
    product.productImage = productImage;
    product.productPrice = productPrice;

    if (productQuantity <= 0 || productPrice <= 0) {
      throw new HttpException(
        "Given number is less or equal 0",
        HttpStatus.BAD_REQUEST
      );
    }

    if (productName.length <= 3) {
      throw new HttpException(
        `Product name should be at least 4 characters. Got ${productName.length}`,
        HttpStatus.BAD_REQUEST
      );
    }

    await product.save();

    return {
      status: true
    };
  }

  async deleteById(id: string): Promise<Res> {
    const removeProduct = await Product.createQueryBuilder()
      .delete()
      .from(Product)
      .where("id = :id", { id })
      .execute();

    if (removeProduct.affected < 1) {
      throw new HttpException(
        `Sorry, there was an error deleting the product. No product with that (${id}) id.`,
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      status: true
    };
  }
}
