import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
// import * as changeCase from 'change-case';
@Injectable()
export class ChangeStringCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('data pass in Pipe : ', JSON.stringify(value));
    return value;
  }
}
