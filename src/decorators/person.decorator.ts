import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Person = createParamDecorator(
  (data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  }
);
