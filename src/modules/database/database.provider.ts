import { readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
import { parse } from 'dotenv';
import { mongoose } from '../../transformers/mongoose.transformer';
import { EmailService } from '../common/services/email.service';
import { EDependencyTokens } from 'src/enums/dependency-tokens.enum';

const envConfig = parse(
  readFileSync(path.join(__dirname, '../../../', '.env')),
);

for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

/**
 * Provider for establishing and managing the database connection.
 *
 * This provider sets up event listeners for monitoring database connection
 * events such as connecting, open, disconnected, and error. It also handles
 * automatic reconnection attempts and sends email alerts on database errors
 * in production environments.
 */
export const databaseProvider = {
  inject: [EmailService],
  provide: EDependencyTokens.DB_CONNECTION_TOKEN,
  useFactory: async (emailService: EmailService) => {
    let reconnectionTask = null;
    const RECONNECT_INTERVAL = 6000;

    /**
     * Sends an email alert for database errors.
     *
     * @param {string} error - The error message to include in the email.
     */
    const sendAlarmMail = (error: string) => {
      emailService.sendMail({
        to: process.env.EMAIL_ADMIN,
        subject: `${process.env.APP_NAME} Database exception！`,
        text: error,
        html: `<pre><code>${error}</code></pre>`,
      });
    };

    /**
     * Establishes the database connection.
     *
     * @returns {Promise<void>} A promise resolving when the connection is established.
     */
    function connection() {
      return mongoose.connect(process.env.DB_URI, {
        // Add MongoDB connection options here if needed
      });
    }

    mongoose.connection.on('connecting', () => {
      console.log('Database connection...');
    });

    mongoose.connection.on('open', () => {
      console.info('Database connection is successful！');
      clearTimeout(reconnectionTask);
      reconnectionTask = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.error(
        `Database connection lost！trying to reconnect in ${RECONNECT_INTERVAL / 1000}s`,
      );
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', (error) => {
      console.error('Database exception！', error);
      mongoose.disconnect();

      // Send DB exception email in production environment
      if (
        process.env.APP_ENV === 'prod' ||
        process.env.APP_ENV === 'production'
      ) {
        sendAlarmMail(String(error));
      }
    });

    // Return the connection promise
    return await connection();
  },
};
