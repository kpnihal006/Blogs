import { ObjectType,Field,Int} from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn,Column } from "typeorm";

@Entity()
@ObjectType()
export class BlogModel {

  @PrimaryGeneratedColumn("increment")
  @Field(type => Int)
  id:number

  @Column()
  @Field()
  title:string

  @Column()
  @Field()
  author:string

  @Column()
  @Field()
  blogSlug:string

  @Column()
  @Field()
  userEmail:string

}