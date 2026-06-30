import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import type { Message, MulticastMessage, BatchResponse } from 'firebase-admin/messaging';
import { firebaseConfig } from '../../config/firebase.config';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private messaging: ReturnType<typeof getMessaging> | null = null;

  constructor(
    @Inject(firebaseConfig.KEY)
    private readonly fbConfig: ConfigType<typeof firebaseConfig>,
  ) {}

  onModuleInit() {
    try {
      if (!fs.existsSync(this.fbConfig.serviceAccountPath)) {
        this.logger.warn(
          `Firebase service account not found at ${this.fbConfig.serviceAccountPath} – push disabled`,
        );
        return;
      }

      const serviceAccount: ServiceAccount = JSON.parse(
        fs.readFileSync(this.fbConfig.serviceAccountPath, 'utf-8'),
      );

      if (getApps().length === 0) {
        initializeApp({ credential: cert(serviceAccount) });
      }
      this.messaging = getMessaging();
      this.logger.log('Firebase initialized successfully');
    } catch (error) {
      this.logger.error(
        `Firebase init failed: ${(error as Error).message}`,
      );
    }
  }

  async sendPush(
    token: string,
    payload: { title: string; body: string; data?: Record<string, string> },
  ): Promise<string | null> {
    if (!this.messaging) return null;
    try {
      const message: Message = {
        token,
        notification: { title: payload.title, body: payload.body },
        data: payload.data,
      };
      return await this.messaging.send(message);
    } catch (error) {
      this.logger.error(`Push send failed: ${(error as Error).message}`);
      return null;
    }
  }

  async sendMulticast(
    tokens: string[],
    payload: { title: string; body: string; data?: Record<string, string> },
  ): Promise<BatchResponse | null> {
    if (!this.messaging) return null;
    try {
      const message: MulticastMessage = {
        tokens,
        notification: { title: payload.title, body: payload.body },
        data: payload.data,
      };
      return await this.messaging.sendEachForMulticast(message);
    } catch (error) {
      this.logger.error(`Multicast failed: ${(error as Error).message}`);
      return null;
    }
  }
}
