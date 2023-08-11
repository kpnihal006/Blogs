import { ObjectType,Field,Int } from "@nestjs/graphql";

@ObjectType()
export class HelloWorldModel {
  value: string;
}