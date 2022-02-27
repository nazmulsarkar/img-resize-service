import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResizeModule } from './resize/resize.module';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [SqsModule, ResizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
