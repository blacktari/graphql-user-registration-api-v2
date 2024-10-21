import { PasswordMixin } from "modules/shared/passwordInput";
import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput extends PasswordMixin(class {}) {
    @Field()
    token: string;
}