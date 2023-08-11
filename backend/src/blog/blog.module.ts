import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import {TypeOrmModule } from '@nestjs/typeorm';
import { BlogModel } from './blog.entity';
import { BlogController } from './blog.controller';

@Module({
  imports:[TypeOrmModule.forFeature([BlogModel])],
  providers: [BlogService, BlogResolver],
  controllers: [BlogController]
})
export class BlogModule {}
