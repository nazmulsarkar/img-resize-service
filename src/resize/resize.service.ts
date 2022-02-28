import { IResizeMessage } from './../sqs/dto/resize-message';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import * as sharp from 'sharp';
import path from 'path';

@Injectable()
export class ResizeService {
  constructor(private storageService: StorageService) { }

  async resizeFileAndReplaceToS3(fileMessage: IResizeMessage) {
    try {
      const resizedFile = await this.getResizedFile(fileMessage);
      await this.storageService.replaceFile(resizedFile, fileMessage.fileKey);
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async getResizedFile(fileMessage: IResizeMessage) {
    try {
      const existFile = await this.storageService.getFile(fileMessage.fileKey);
      const ext = path.extname(fileMessage.fileKey).replace('.', '');

      console.log(fileMessage);
      const file = await sharp(existFile.data.Body)
        .resize({
          width: fileMessage.fileWidth,
          height: fileMessage.fileHeight,
        })
        .toFormat(ext)
        .toBuffer();

      return file;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
