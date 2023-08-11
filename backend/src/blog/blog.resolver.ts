import { Args, Mutation, Query, Resolver, Int, Subscription } from '@nestjs/graphql';
import { BlogService } from "./blog.service";
import { BlogModel } from "./blog.entity";
import { CreateBlogInput } from './dto/createBlog';
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub();

@Resolver()
export class BlogResolver {
  constructor(private blogService:BlogService) {}

  @Query( returns => [BlogModel])
  async sayBlog() : Promise<BlogModel[]> {
    return await this.blogService.sayBlog();
  }
  @Query(returns => [BlogModel])
  async sayBlogByUser(@Args('userEmail', {type: () => String }) userEmail:string) : Promise<BlogModel[]> {
    return await this.blogService.sayBlogByUser(userEmail);
  }

  @Mutation(returns => BlogModel)
  createBlog(@Args('createBlogInput') createBlogInput:CreateBlogInput) : Promise<BlogModel> {
      const newBlog = this.blogService.createBlog(createBlogInput);
      pubSub.publish('newBlogNotify',{newBlogNotify:newBlog});
      return newBlog

  }

  @Subscription(returns => BlogModel)
  newBlogNotify() {
    return pubSub.asyncIterator('newBlogNotify')
  }

}
