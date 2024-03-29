import { JwtPayload } from './jwt.payload';
import { UserRepository } from './user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    
    //used for creating jwt token
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDTO: AuthCredentialsDTO) {
    return this.userRepository.signup(authCredentialsDTO);
  }
  async signin(authCredentialsDTO: AuthCredentialsDTO) {
    const user = await this.userRepository.signin(authCredentialsDTO);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    //create JWT token
    const payload: JwtPayload = {
      username: authCredentialsDTO.username,
      id: user.id,
    };

    //create and return the token
    const token = await this.jwtService.sign(payload);
    return { token };
  }
}
