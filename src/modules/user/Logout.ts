import { MyContext } from "src/types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            // Ensure session exists before attempting to destroy it
            if (!ctx.req.session) {
                return resolve(false);
            }

            ctx.req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                    return reject(false);
                }

                // Clear the session cookie
                ctx.res.clearCookie('qid');
                return resolve(true);
            });
        });
    }
}