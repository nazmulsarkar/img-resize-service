import { StorageModule } from './../storage/storage.module';
import { Module } from '@nestjs/common';
import { ResizeService } from './resize.service';

@Module({
  imports: [StorageModule],
  providers: [ResizeService],
})
export class ResizeModule { }
