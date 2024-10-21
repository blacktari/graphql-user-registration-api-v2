import { Query, Resolver, Mutation, Arg, UseMiddleware, } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from "../../entity/user"; 
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth, logger)
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Mutation(() => User)
    async register(
        @Arg("data") 
        {
         email, 
         firstName, 
         lastName, 
         password
        }: RegisterInput): Promise<User> { 
        const hashedPassword = await bcrypt.hash(password, 12); // Await the bcrypt.hash call

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save();

        await sendEmail(email, await createConfirmationUrl(user.id));

        return user;
    }
}