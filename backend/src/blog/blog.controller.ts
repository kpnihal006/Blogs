import { Controller,Get, Param, Post, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './dto/createBlog';

@Controller('blog')
export class BlogController {
    constructor(private BlogService: BlogService) {}

  @Get(':userEmail')
  getBlogbyUser(@Param() params) {
    return this.BlogService.sayBlogByUser(params.userEmail);
  }

  @Post()
  createBlog(@Body() createBlogInput:CreateBlogInput) {
    return this.BlogService.createBlog(createBlogInput)
  }

  @Get()
  getBlog() {
    return this.BlogService.sayBlog();
  }
  }
