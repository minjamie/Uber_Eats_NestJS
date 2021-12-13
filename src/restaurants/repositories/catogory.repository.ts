import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
// custom repository,
// 1. repository를 extend하는 법
// 2. abstract repository class를 extend 하는 법
// 3. Entity repository 만들고 constructor 등등을 가지는 것
// catogory get or create 구현법
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getOrCreate(name: string): Promise<Category> {
    try {
      const categoryName = name.trim().toLocaleLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.findOne({
        slug: categorySlug,
      });

      if (!category) {
        category = await this.save(
          this.create({
            slug: categorySlug,
            name: categoryName,
          }),
        );
      }
      return category;
    } catch (error) {}
  }
}
