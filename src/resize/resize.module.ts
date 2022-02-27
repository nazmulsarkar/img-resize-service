import { Module } from '@nestjs/common';
import { ResizeService } from './resize.service';

@Module({
  providers: [ResizeService]
})
export class ResizeModule {}
