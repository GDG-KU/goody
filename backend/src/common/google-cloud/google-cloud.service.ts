/*
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  async getPresignedUrl(fileName: string) {
    const s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
      signatureVersion: 'v4',
    });

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60 * 5, // presigned URL 유효기간(초)
      ContentType: 'image/jpeg', // 상황에 맞게 ContentType 설정
    };

    try {
      const preSignedUrl = await s3.getSignedUrlPromise('putObject', params);
      // 필요한 정보(예: 파일 이름, presigned url) 등을 반환
      return { preSignedUrl, fileName };
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(`Failed to create presigned URL: ${error.message}`);
      }
      throw new Error('Failed to create presigned URL: Unknown error occurred');
    }
  }
}*/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleCloudService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    // Google Cloud Storage 클라이언트 초기화
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCP_PROJECT_ID'), // GCP 프로젝트 ID
      keyFilename: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'), // 서비스 계정 키 파일 경로
    });

    // 버킷 이름 가져오기
    this.bucketName = this.configService.get<string>('GCP_BUCKET_NAME') || '';
    if (!this.bucketName) {
      throw new Error('GCP_BUCKET_NAME is not defined in the configuration');
    }
  }

  async getPresignedUrl(fileName: string) {
    const bucket = this.storage.bucket(this.bucketName);

    // GCS에 저장될 고유한 파일 이름 생성 (UUID 사용)
    const filePath = `${uuidv4()}-${fileName}`;
    const file = bucket.file(filePath);

    // Presigned URL 유효기간 설정
    const expires = Date.now() + 5 * 60 * 1000; // 5분 후 만료

    try {
      // Signed URL 생성
      const [preSignedUrl] = await file.getSignedUrl({
        version: 'v4', // Signed URL 버전
        action: 'write', // 파일 업로드 용도로 설정
        expires, // 만료 시간
        contentType: 'image/jpeg', // 업로드 파일의 Content-Type 설정
      });

      // 필요한 정보(예: 파일 이름, presigned URL) 반환
      return { preSignedUrl, fileName: filePath };
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(`Failed to create presigned URL: ${error.message}`);
      }
      throw new Error('Failed to create presigned URL: Unknown error occurred');
    }
  }
}

