import {
  BadRequestException,
  Injectable,
  type ArgumentMetadata,
  type PipeTransform,
} from '@nestjs/common';

/** 将路由参数转换为正整数，并在参数不合法时终止请求。 */
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      const fieldName = metadata.data ?? 'value';
      throw new BadRequestException(`${fieldName} 必须是正整数`);
    }

    return parsedValue;
  }
}
