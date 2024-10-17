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
import { OAuth2Client } from 'google-auth-library';


@Injectable()
export class AuthService {
    private client: OAuth2Client;

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        console.log('GOOGLE_CLIENT_ID:', clientId);
        this.client = new OAuth2Client(clientId);
    }

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
          throw new BadRequestException({email: 'Email already exists'}); 
        }
    
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        
        const user = await this.userModel.create({
            fullname: registerDto.fullname,
            password: hashedPassword,
            email: registerDto.email,
        });
    
        // Log the created user to verify fullname
        console.log('Created User:', user.toObject({ getters: true, virtuals: true }));
    
        // Convert user to plain object to ensure serialization
        const plainUser = user.toObject({ getters: true, virtuals: true });
        
        return this.issueTokens(plainUser, response); 
    }

    async login(loginDto: LoginDto, response: Response) {
        const user = await this.validateUser(loginDto);
    
        if (!user) {
          throw new BadRequestException({invalidCredentials: 'Invalid credentials'}); 
        }
    
        return this.issueTokens(user, response);
      }
    
    async logout(response: Response) {
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        return 'Successfully logged out';
    }

    async googleLogin(token: string, response: Response) {
        try {
          console.log('Received token:', token);
          const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
          });
          const payload = ticket.getPayload();
          console.log('Verified payload:', payload);
          if (!payload || !payload.email) {
            throw new BadRequestException('Invalid Google token payload');
          }
          const email = payload.email;
      
          let user = await this.userModel.findOne({ email });
      
          if (!user) {
            user = await this.userModel.create({
              email,
              fullname: payload.name || '',
              googleId: payload.sub,
            });
          }
      
          return this.issueTokens(user, response);
        } catch (error) {
          console.error('Google login error:', error);
          throw new BadRequestException('Invalid Google token: ' + error.message);
        }
      }
    
}


