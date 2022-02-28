import { Module } from '@nestjs/common';
import { ResizeModule } from '../resize/resize.module';
import { SqsService } from './sqs.service';

@Module({
  imports: [ResizeModule],
  providers: [SqsService],
})
export class SqsModule { }
