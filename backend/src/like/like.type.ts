import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class LikeType {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    postId: string;
}