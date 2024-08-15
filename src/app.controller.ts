import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { AIServiceClient, AIServiceController, MediaRecommendationRequest, MediaRecommendationResponse } from './ai_service.pb';
import { Observable } from 'rxjs';

@Controller()
export class AppController implements AIServiceController{
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('AIService', 'MediaRecommendation')
  mediaRecommendation(request: MediaRecommendationRequest): Promise<MediaRecommendationResponse> | Observable<MediaRecommendationResponse> | MediaRecommendationResponse {
    return this.appService.mediaRecommendation(request);
  }


}
