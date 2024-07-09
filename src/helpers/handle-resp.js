import { logger } from "./logger.js";

export const handleResponse = (res, promise) => {
  logger.info('Start request in handling response');
  promise
      .then(data => {
          res.status(200).json(data);
          logger.info('Request successful');
      })
      .catch(error => {
          res.status(500).json({ error: 'Internal server error' });
          logger.error('Error:', error);
      });
};