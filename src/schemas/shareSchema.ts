import Joi from 'joi';

export const createShareInputSchema = Joi.object({
  shareName: Joi.string().required(),
  sharePrice: Joi.number().precision(2).min(0.01).required(),
  shareSymbol: Joi.string().uppercase().min(3).max(3).required(),
  shareQuantity: Joi.number().required(),
});

const updateShareInputSchema = Joi.object({
  shareId: Joi.string().required(),
  sharePrice: Joi.number().precision(2).required(),
});

export class ShareSchemaValidator {
  static async createShareInputSchemaValidator(data: any) {
    return await createShareInputSchema.validateAsync(data);
  }

  static async updateShareInputSchemaValidator(data: any) {
    return await updateShareInputSchema.validateAsync(data);
  }
}
