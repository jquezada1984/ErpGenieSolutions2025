import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => UserResponse)
  user: UserResponse;
} 