import { registerAs } from '@nestjs/config';
import * as path from 'path';

export const firebaseConfig = registerAs('firebase', () => ({
  serviceAccountPath:
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
    path.resolve(process.cwd(), 'firebase-service-account.json'),
}));
