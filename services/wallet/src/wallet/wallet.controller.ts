import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service'
import { TopUpDto } from './dto/top-up.dto'
import { SpendDto } from './dto/spend.dto'

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':wristbandId/balance')
  getBalance(@Param('wristbandId') wristbandId: string) {
    return this.walletService.getBalance(wristbandId);
  }

  @Post(':wristbandId/top-up')
  topUp(
    @Param('wristbandId') wristbandId: string,
    @Body() payload: TopUpDto
  ) {
    return this.walletService.topUp(wristbandId, payload);
  }

  @Post(':wristbandId/spend')
  spend(
    @Param('wristbandId') wristbandId: string,
    @Body() payload: SpendDto
  ) {
    return this.walletService.spend(wristbandId, payload);
  }
}
