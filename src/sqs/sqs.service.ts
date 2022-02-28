import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { IResizeMessage } from './dto/resize-message';
import { ResizeService } from '../resize/resize.service';

@Injectable()
export class SqsService {
  private readonly sqs: SQS;
  private readonly queueName: string;
  private readonly accountId: string;
  private readonly queueUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly resizeService: ResizeService
  ) {
    this.sqs = new SQS({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
      apiVersion: 'latest',
    });

    this.accountId = this.configService.get('SQS_ACCOUNT_ID');
    this.queueName = this.configService.get('SQS_QUEUE_NAME');
    this.queueUrl = `https://sqs.us-east-1.amazonaws.com/${this.accountId}/${this.queueName}`
  }

  async receiveFromQueue() {
    // Setup the receiveMessage parameters
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0,
    };

    this.sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        if (!data.Messages) {
          console.log('Nothing to process');
          return;
        }
        const resizeData: IResizeMessage = JSON.parse(data.Messages[0].Body);
        console.log('Resize queue received', resizeData);
        // Lookup order data from data storage

        this.resizeService.resizeFileAndReplaceToS3(resizeData);
        // Now we must delete the message so we don't handle it again
        const deleteParams = {
          QueueUrl: this.queueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };

        this.sqs.deleteMessage(deleteParams, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data),
              console.log('Successfully deleted message from queue');
          }
        });
      }
    });
  }
}
