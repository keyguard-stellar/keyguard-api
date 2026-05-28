import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChallengeAuthDto } from './dto/challenge-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('challenge')
  @HttpCode(HttpStatus.OK)
  getChallenge(@Body() challengeDto: ChallengeAuthDto) {
    return this.authService.generateChallenge(challengeDto.publicKey);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyChallenge(@Body() verifyDto: VerifyAuthDto) {
    return this.authService.verifyChallenge(verifyDto.transaction);
  }
}
