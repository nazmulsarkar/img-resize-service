import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResizeModule } from './resize/resize.module';
import { SqsModule } from './sqs/sqs.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [SqsModule, StorageModule, ResizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
