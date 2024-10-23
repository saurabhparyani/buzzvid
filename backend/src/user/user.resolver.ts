import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { RegisterResponse, LoginResponse } from 'src/auth/types';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { Request, Response } from 'express';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { User } from './user.model';
import { GraphqlAuthGuard } from 'src/auth/gql-auth.guard';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Resolver()
export class UserResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @UseFilters(GraphQLErrorFilter)

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
            const { user } = await this.authService.register(
                registerDto,
                context.res,
            );
            console.log('Registered User:', user);
            return { user };
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

    @Mutation(() => LoginResponse)
    async googleLogin(
        @Args('token') token: string,
        @Context() context: { res: Response },
        ): Promise<LoginResponse> {
            return this.authService.googleLogin(token, context.res);
    }

    @Query(() => String)
    async hello() {
        return 'Hello World';
    }

    @Query(() => [User])
    async getUsers() {
        return this.userService.getUsers();
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => User)
    async updateProfile(
        @Context()
        context: {req: Request},
        @Args('fullname', {type: () => String, nullable: true}) fullname: string,
        @Args('bio', {type: () => String, nullable: true}) bio: string,
        @Args('image', {type: () => GraphQLUpload, nullable: true}) image: GraphQLUpload,
    ) {
        let imageUrl;
        if(image) imageUrl = await this.storeImageAndGetUrl(image)
        
        return this.userService.updateProfile(context.req.user.sub, {fullname, bio, image: imageUrl})
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => User)
    async updateGoogleProfile(
        @Context()
        context: {req: Request},
        @Args('fullname', {type: () => String, nullable: true}) fullname: string,
        @Args('bio', {type: () => String, nullable: true}) bio: string,
        @Args('googleImage', {type: () => GraphQLUpload, nullable: true}) googleImage: GraphQLUpload,
    ) {
        let imageUrl;
        if(googleImage) imageUrl = await this.storeImageAndGetUrl(googleImage)
        
        return this.userService.updateGoogleProfile(context.req.user.sub, {fullname, bio, googleImage: imageUrl})
    }

    private async storeImageAndGetUrl(file: GraphQLUpload): Promise<string> {
        const { createReadStream, filename } = await file;

        const uniqueFileName = `${uuidv4()}_${filename}`;
        const imagePath = join(process.cwd(), 'public', uniqueFileName);
        const imageUrl = `${process.env.APP_URL}/${uniqueFileName}`;

        const readStream = createReadStream();
        readStream.pipe(createWriteStream(imagePath));

        return imageUrl;
    }
}
