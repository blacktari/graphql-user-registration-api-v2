import { Resolver, Mutation, Arg, Ctx, } from "type-graphql";
import bcript from "bcryptjs";

import { User } from "src/entity/user";
import { forgotPasswordPrefix } from "../constance/redisPrefix";
import { redis } from "src/redis";
import { ChangePasswordInput } from "./changePassword/changePasswordInput";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("data") 
        {
            token, 
            password
        }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token);

        if (!userId) {
            return null
        }

        const user = await User.findOne(userId);

        if (!user) {
            return null
        }

        await redis.del(forgotPasswordPrefix + token)

        user.password = await bcript.hash(password, 12);

        await user.save();

        ctx.req.session!.userId = user.id;

        return user;
    }
}