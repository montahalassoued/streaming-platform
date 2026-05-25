import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubscriptionTierEntity } from "./entities/subscription-tier.entity";

@Injectable()
export class SubscriptionTiersService {
  constructor(
    @InjectRepository(SubscriptionTierEntity)
    private readonly repo: Repository<SubscriptionTierEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<SubscriptionTierEntity>) {
    const ent = this.repo.create(data as any);
    return this.repo.save(ent);
  }

  update(id: string, data: Partial<SubscriptionTierEntity>) {
    return this.repo.update(id, data as any);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
