import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  index(@Res() res) {
    res.status(302).redirect('/api/docs');
  }
}
