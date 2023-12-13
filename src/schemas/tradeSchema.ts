import Joi from 'joi';

const tradeSchema = Joi.object({
  shareId: Joi.string().required(),
  userId: Joi.string().required(),
  qty: Joi.number().min(1).required(),
});

export class TradeSchema {
  static async tradeSchemaValidator(data: any) {
    return await tradeSchema.validateAsync(data,{ abortEarly: false });
  }
}
