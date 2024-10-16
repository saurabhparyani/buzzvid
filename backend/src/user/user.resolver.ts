import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { RegisterResponse, LoginResponse } from 'src/auth/types';
import { BadRequestException } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { Request, Response } from 'express';

@Resolver()
export class UserResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Mutation(() => RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() context: { res: Response },
    ): Promise<RegisterResponse> {
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new BadRequestException({
                confirmPassword: 'Password and confirm password are not the same.',
            });
        }
        try {
            const { user } = await this.authService.register(
                registerDto,
                context.res,
            );
            console.log('user!', user);
            return { user };
        } catch (error) {
            // Handle the error, for instance if it's a validation error or some other type
            return {
                error: {
                    message: error.message,
                    // code: 'SOME_ERROR_CODE' // If you have error codes
                },
            };
        }
    }

    @Mutation(() => LoginResponse)
    async login(
        @Args('loginInput') loginDto: LoginDto,
        @Context() context: { res: Response },
    ): Promise<LoginResponse> {
        return this.authService.login(loginDto, context.res);
    }

    @Mutation(() => String)
    async logout(@Context() context: { res: Response }) {
        return this.authService.logout(context.res);
    }

    @Mutation(() => String)
    async refreshToken(@Context() context: { req: Request; res: Response }) {
        try {
        return this.authService.refreshToken(context.req, context.res);
        } catch (error) {
        throw new BadRequestException(error.message);
        }
    }

    @Query(() => String)
    async hello() {
        return 'Hello World';
    }
}
