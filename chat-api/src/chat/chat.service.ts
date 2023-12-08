import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

const logger = new Logger('ChatService');

@Injectable()
export class ChatService {
  openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async translateMessage(
    message: string,
    targetLanguage: string,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `Translate to ${targetLanguage}: ${message}`,
        },
      ],
    });
    logger.log(
      `response.choices[0].message.content : ${response.choices[0].message.content}`,
    );
    return response.choices[0].message.content;
  }

  async validateMessage(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `In order to promote the accuracy and reliability of information in discussions,
            I want you to verify a message from a chat.
            You need to check it and report it if the information seems inaccurate or misleading.
            Answer in one complete sentence, in the same language as the message.
            Check this message the following message : "${message}"`,
          },
        ],
      });

      // Renvoie le résultat de la validation (ajustez selon les réponses d'OpenAI)
      return response.choices[0].message.content;
    } catch (error) {
      return error.message;
    }
  }
}
