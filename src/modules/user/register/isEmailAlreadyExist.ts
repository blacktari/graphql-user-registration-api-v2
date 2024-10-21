import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

import { User } from "../../../entity/user";

// Custom validator to check if the email already exists in the database
@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistsConstraint
  implements ValidatorConstraintInterface {
  async validate(email: string) {
    // Check if the email already exists
    const user = await User.findOne({ where: { email } });
    return !user; // Return true if email does not exist, otherwise false
  }
}

// Decorator function to use the custom validator
export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistsConstraint
        });
    }
}