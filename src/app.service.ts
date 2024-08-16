import { Injectable } from '@nestjs/common';
import { MediaRecommendationRequest, MediaRecommendationResponse } from './ai_service.pb';

@Injectable()
export class AppService {
  private readonly REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  async mediaRecommendation(request: MediaRecommendationRequest): Promise<MediaRecommendationResponse> {
    const mediaListString = request.mediaList.map((media) => {
      return `{"title": "${media.title}","mediaType": "${media.mediaType}"}`;
    }).join(',');

    const prompt = `[${mediaListString}]`;
    console.log(prompt);

    // Configurar el payload para la API
    const payload = {
      stream: false,
      input: {
        top_k: 0,
        top_p: 0.9,
        prompt: prompt,
        max_tokens: 500,
        min_tokens: 400,
        temperature: 0.6,
        system_prompt: "Recommend me movies or series based on the list. Use this format: title: why do you recommend it",
        presence_penalty: 1.15,
        frequency_penalty: 0,
        length_penalty: 1,
      },
    };

    // Hacer la llamada a la API
    const response = await fetch('https://api.replicate.com/v1/models/meta/meta-llama-3.1-405b-instruct/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.REPLICATE_API_TOKEN}`, // Aquí asumo que el token está en una variable de entorno
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const newURL = data.urls.get;



    // Intentar obtener el resultado hasta que el estado sea "succeeded"
    let recommendation = [];
    let attempts = 0;
    let status = 'processing';

    while (status !== 'succeeded' && attempts < 5) {

      await new Promise((resolve) => setTimeout(resolve, attempts == 0 ? 6000 : 1000));

      const response2 = await fetch(newURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const data2 = await response2.json();
      status = data2.status;
      recommendation = data2.output;
      if (status === 'succeeded') {
        break;
      }

      attempts++;
    }

    console.log(recommendation);
    const recommendationText = recommendation.join("");
    console.log(recommendationText);
    return {
      recommendation: recommendationText, status: status
    };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
