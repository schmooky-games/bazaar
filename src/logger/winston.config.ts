import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('Bazaar', {
    prettyPrint: true,
    colors: true,
  }),
);

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: logFormat,
    }),
  ],
};
