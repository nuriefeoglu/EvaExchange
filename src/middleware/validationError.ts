import { Error } from '../models/JoiError';

export const validationError = (data: any[]): Error[] => {
  return data.map((i) => {
    const errorMessage = i.message.replace(/['"]+/g, '');
    return { errorMessage: errorMessage };
  });
};
