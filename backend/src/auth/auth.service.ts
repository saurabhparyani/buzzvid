/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"
import { User, UserDocument } from "src/user/user.model";
import * as bcrypt from "bcrypt"
import {Response, Request} from "express"
import {ConfigService} from "@nestjs/config"
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from './dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async refreshToken(req: Request, res: Response): Promise<string> {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
            })
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const userExists = await this.userModel.findById(payload.sub).exec();
        if (!userExists) {
            throw new BadRequestException('User no longer exists');
        }

        const expiresIn = 15000; // seconds
        const expiration = Math.floor(Date.now() / 1000) + expiresIn;
        const accessToken = this.jwtService.sign(
            { ...payload, exp: expiration },
            {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            },
        );

        res.cookie('access_token', accessToken, { httpOnly: true });

        return accessToken;
    }


    private async issueTokens(user: User, response: Response) {
        const payload = { username: user.fullname, sub: user._id };
    
        const accessToken = this.jwtService.sign(
          { ...payload },
          {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: '150sec',
          },
        );
    
        const refreshToken = this.jwtService.sign(payload, {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        });
    
        response.cookie('access_token', accessToken, { httpOnly: true });
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
        });
    
        return { user };
    }

    async validateUser(loginDto: LoginDto): Promise<any> {
        const user = await this.userModel.findOne({
            email: loginDto.email
        });
        if (user && (await bcrypt.compare(loginDto.password, user.password))) {
          return user;
        }
        return null;
    }

    async register(registerDto: RegisterDto, response: Response) {
        const existingUser = await this.userModel.findOne({
            email: registerDto.email
        });
    
        if (existingUser) {
          throw new Error('Email already exists'); 
        }
    
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        
        const user = await this.userModel.create({
            fullname: registerDto.fullname,
            password: hashedPassword,
            email: registerDto.email,
        })
        return this.issueTokens(user, response); 
    }

    async login(loginDto: LoginDto, response: Response) {
        const user = await this.validateUser(loginDto);
    
        if (!user) {
          throw new Error('Invalid credentials'); 
        }
    
        return this.issueTokens(user, response);
      }
    
    async logout(response: Response) {
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        return 'Successfully logged out';
    }
}


