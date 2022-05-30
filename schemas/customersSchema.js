import BaseJoi from 'joi';
import JoiDate from '@joi/date';

const Joi = BaseJoi.extend(JoiDate);

const customersSchema = Joi.object({
    name: Joi.string().required(),
    cpf: Joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10,11}$')).required(),
    birthday: Joi.date().format('YYYY-MM-DD').utc().required()
});

export default customersSchema;