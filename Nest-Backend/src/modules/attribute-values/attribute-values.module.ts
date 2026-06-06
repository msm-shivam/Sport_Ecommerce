import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValue } from './entities/attribute-value.entity';
import { AttributeValuesService } from './attribute-values.service';
import { AttributeValuesController } from './attribute-values.controller';
import { AttributesModule } from '../attributes/attributes.module';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValue]), AttributesModule],
  controllers: [AttributeValuesController],
  providers: [AttributeValuesService],
  exports: [AttributeValuesService],
})
export class AttributeValuesModule {}
