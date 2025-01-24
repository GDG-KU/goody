/*
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsService } from './google-cloud.service';
import { AwsController } from './google-cloud.controller';

@Module({
  imports: [ConfigModule],
  providers: [AwsService],
  exports: [AwsService],
  controllers: [AwsController],
})
export class AwsS3Module {}
*/

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleCloudService } from './google-cloud.service';
import { GoogleCloudController } from './google-cloud.controller';

@Module({
  imports: [ConfigModule],
  providers: [GoogleCloudService],
  exports: [GoogleCloudService],
  controllers: [GoogleCloudController],
})
export class GoogleCloudModule {}
