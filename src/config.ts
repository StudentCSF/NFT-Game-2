import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand'
import { cleanEnv, num, str, bool } from 'envalid';

const env = dotenv.config();
dotenvExpand.expand(env)

export default cleanEnv(process.env, {
  PORT: num(),

  MORALIS_API_KEY: str(),

  DATABASE_URI: str(),
  DATABASE_NAME: str(),
  // DATABASE_COLLECTION: str(),

  CLOUD_PATH: str(),
  APP_NAME: str(),

  SERVER_ENDPOINT: str(),
  MASTER_KEY: str(),
  APPLICATION_ID: str(),
  BASE_URI: str(),
  BASE_SERVER_URL: str(),
  SERVER_URL: str(),
  CLIENT_URL: str(),

  ALLOW_INSECURE_HTTP: bool({ default: false }),
});