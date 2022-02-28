import { IResizeMessage } from './../sqs/dto/resize-message';
import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ResizeService {
  constructor(private storageService: StorageService) { }

  async resizeFileAndReplaceToS3(fileMessage: IResizeMessage) {
    const file = await this.storageService.getFile(fileMessage.fileKey);

    const resizedFile = await this.getResizedFile(file, fileMessage);
    this.storageService.replaceFile(resizedFile, fileMessage.fileKey);
  }

  async getResizedFile(file: any, fileMessage: IResizeMessage) {
    console.log(fileMessage);
    return file;
  }
}
