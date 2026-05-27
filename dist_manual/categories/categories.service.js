"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
let CategoriesService = class CategoriesService {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async findAll(query = {}) {
        const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
        const where = query.search
            ? { name: (0, typeorm_2.ILike)(`%${query.search}%`) }
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
    async findOne(id) {
        const category = await this.categoryRepo.findOne({
            where: { id },
            relations: { parent: true, children: true },
        });
        if (!category)
            throw new common_1.NotFoundException("Category not found");
        return category;
    }
    async create(createCategoryDto) {
        const category = this.categoryRepo.create({
            name: createCategoryDto.name,
            slug: createCategoryDto.slug,
            parentId: createCategoryDto.parentId ?? null,
            thumbnailUrl: createCategoryDto.thumbnailUrl ?? null,
        });
        return this.categoryRepo.save(category);
    }
    async update(id, updateCategoryDto) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category)
            throw new common_1.NotFoundException("Category not found");
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
    async remove(id) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category)
            throw new common_1.NotFoundException("Category not found");
        await this.categoryRepo.remove(category);
        return { ok: true };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
