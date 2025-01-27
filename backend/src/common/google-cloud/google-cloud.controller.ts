/*
import { Controller, Get, Query } from '@nestjs/common';
import { AwsService } from './google-cloud.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('s3')
  getPresignedUrl(@Query('fileName') fileName: string) {
    // fileName을 Query로 전달받았다고 가정
    return this.awsService.getPresignedUrl(fileName);
  }
}
*/
import { Controller, Get, Query } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';

@Controller('google-cloud')
export class GoogleCloudController {
  constructor(private readonly googleCloudService: GoogleCloudService) {}

  @Get('signed-url')
  getPresignedUrl(@Query('fileName') fileName: string) {
    // Query로 전달받은 fileName을 서비스로 전달
    return this.googleCloudService.getPresignedUrl(fileName);
  }
}
