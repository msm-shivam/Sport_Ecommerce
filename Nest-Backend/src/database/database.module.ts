import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserSession } from '../modules/users/entities/user-session.entity';
import { AdminUser } from '../modules/admin/entities/admin-user.entity';
import { AdminSession } from '../modules/admin/entities/admin-session.entity';
import { Role } from '../modules/rbac/entities/role.entity';
import { Permission } from '../modules/rbac/entities/permission.entity';
import { OtpVerification } from '../modules/auth/entities/otp-verification.entity';
import { Brand } from '../modules/brands/entities/brand.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { SubCategory } from '../modules/sub-categories/entities/sub-category.entity';
import { Collection } from '../modules/collections/entities/collection.entity';
import { Attribute } from '../modules/attributes/entities/attribute.entity';
import { AttributeValue } from '../modules/attribute-values/entities/attribute-value.entity';
import { ProductTag } from '../modules/product-tags/entities/product-tag.entity';
import { ProductTagMapping } from '../modules/product-tags/entities/product-tag-mapping.entity';
import { ProductCollection } from '../modules/collections/entities/product-collection.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('app.nodeEnv') === 'production';

        return {
          type: 'postgres',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          entities: [
            User,
            UserSession,
            AdminUser,
            AdminSession,
            Role,
            Permission,
            OtpVerification,
            Brand,
            Category,
            SubCategory,
            Collection,
            Attribute,
            AttributeValue,
            ProductTag,
            ProductTagMapping,
            ProductCollection,
          ],
          migrations: ['dist/database/migrations/*.js'],
          synchronize: false,
          logging: !isProd,
          ssl: isProd ? { rejectUnauthorized: false } : false,
          extra: {
            min: 2,
            max: isProd ? 20 : 10,
            connectionTimeoutMillis: 10_000,
            idleTimeoutMillis: 30_000,
            allowExitOnIdle: false,
          },
          cache: {
            duration: 5_000,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
