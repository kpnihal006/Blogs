import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateBlogInput {
    @Field()
    title:string;

    @Field()
    author:string;

    @Field()
    blogSlug:string;

    @Field()
    userEmail:string;
}