// common/utils/file-upload.utils.ts
import { extname } from 'path';
import { Request } from 'express';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    // 지원하지 않는 파일 형식인 경우
    return callback(new Error('지원하지 않는 파일 형식입니다.'), false);
  }
  // 파일 형식이 유효한 경우
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  // 원본 파일 이름에서 확장자 제거
  const name = file.originalname.split('.')[0];
  // 파일 확장자 추출
  const fileExtName = extname(file.originalname);
  // 고유한 랜덤 문자열 생성
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  // 새로운 파일 이름 생성
  callback(null, `${name}-${randomName}${fileExtName}`);
};
