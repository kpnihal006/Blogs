import { Injectable} from '@nestjs/common';
import { BlogModel } from './blog.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogInput } from './dto/createBlog';
import { PubSub } from 'graphql-subscriptions';
const pubSub = new PubSub();

@Injectable()
export class BlogService {
    constructor(@InjectRepository(BlogModel) private blogRepository:Repository<BlogModel>) {}

    createBlog(createBlogInput:CreateBlogInput): Promise<BlogModel> {
        const newBlog = this.blogRepository.create(createBlogInput);
        pubSub.publish('newBlogNotify',{newBlogNotify:newBlog})
        return this.blogRepository.save(newBlog);
    }

    async sayBlog() : Promise<BlogModel[]> {
        return this.blogRepository.find();
    }

    sayBlogByUser(userEmail:string) : Promise<BlogModel[]> {
        return this.blogRepository.findBy({userEmail: userEmail});
    }
  }