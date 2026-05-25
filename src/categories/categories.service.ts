import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  findAll() {
    return [{ message: "Categories list placeholder" }];
  }

  findOne(id: string) {
    return { message: "Category detail placeholder", id };
  }

  create(createCategoryDto: CreateCategoryDto) {
    return { message: "Category created placeholder", data: createCategoryDto };
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return {
      message: "Category updated placeholder",
      id,
      data: updateCategoryDto,
    };
  }

  remove(id: string) {
    return { message: "Category removed placeholder", id };
  }
}
