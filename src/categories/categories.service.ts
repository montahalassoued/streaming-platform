import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ListCategoriesQueryDto } from "./dto/list-categories-query.dto";
import { CategoryEntity } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(query: ListCategoriesQueryDto = {}) {
    const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
    const where = query.search
      ? { name: ILike(`%${query.search}%`) }
      : undefined;

    const [items, total] = await this.categoryRepo.findAndCount({
      where,
      relations: { parent: true },
      order: { name: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: total > page * limit,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepo.create({
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
      parentId: createCategoryDto.parentId ?? null,
      thumbnailUrl: createCategoryDto.thumbnailUrl ?? null,
    });
    return this.categoryRepo.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException("Category not found");

    if (updateCategoryDto.name !== undefined)
      category.name = updateCategoryDto.name;
    if (updateCategoryDto.slug !== undefined)
      category.slug = updateCategoryDto.slug;
    if (updateCategoryDto.parentId !== undefined)
      category.parentId = updateCategoryDto.parentId ?? null;
    if (updateCategoryDto.thumbnailUrl !== undefined)
      category.thumbnailUrl = updateCategoryDto.thumbnailUrl ?? null;

    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException("Category not found");
    await this.categoryRepo.remove(category);
    return { ok: true };
  }
}
