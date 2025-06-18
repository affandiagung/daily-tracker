import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const now = new Date();
          const inputDate = new Date(value);

          // Set time to 00:00:00 for comparison (optional)
          now.setHours(0, 0, 0, 0);
          inputDate.setHours(0, 0, 0, 0);

          return inputDate >= now;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be in the past.`;
        },
      },
    });
  };
}
