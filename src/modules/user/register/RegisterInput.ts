import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
import { PasswordMixin } from "../../shared/passwordInput";

@InputType()
export class RegisterInput extends PasswordMixin(class RegisterInputBase {}) {
    @Field()
    @Length(1, 255)
    firstName: string;

    @Field()
    @Length(1, 255)
    lastName: string;

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: "email already in use" })
    email: string;
}