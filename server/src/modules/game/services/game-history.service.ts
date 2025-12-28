import { Injectable } from '@nestjs/common';

@Injectable()
export class GameHistoryService {
  create(_history: any): Promise<any> {
    return Promise.resolve({});
  }
}
