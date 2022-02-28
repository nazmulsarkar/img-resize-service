import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { DeleteFileDTO } from './dto/delete-file.dto';

@Injectable()
export class StorageService {
  private readonly s3: S3;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
    this.bucket = this.configService.get('AWS_PRIVATE_BUCKET_NAME');
  }

  public async generatePreSignedUrl(key: string) {
    return await this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
    });
  }

  public async getFile(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    return new Promise((resolve, reject) => {
      this.s3.getObject(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          console.log('Successfully dowloaded data from  bucket');
          resolve(data);
        }
      });
    });
  }

  public async replaceFile(dataBuffer: Buffer, key: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.bucket,
        Body: dataBuffer,
        Key: key,
        Tagging: '“public”=yes',
      })
      .promise();
    return uploadResult;
  }

  public async deleteFile(fileKey: string) {
    const params = new DeleteFileDTO();
    params.Key = fileKey;
    params.Bucket = this.bucket;
    return await this.s3.deleteObject(params).promise();
  }
}
