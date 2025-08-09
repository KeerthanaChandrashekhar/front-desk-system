import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Hardcoded receptionist user
  private users = [
    {
      id: 1,
      username: 'receptionist',
      password:  '$2b$10$zfqYAOTQiVc4ACZdMN3pYeg7BAjR.FxurmycimHd5Vg04wvzBSNJ2', // 'admin123'
    },
  ];

  async validateUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (!user) throw new UnauthorizedException('Invalid username');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return { id: user.id, username: user.username };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
