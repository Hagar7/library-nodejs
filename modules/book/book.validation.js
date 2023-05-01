import Joi from "joi";

export const validationaddBook = {
    body: Joi.object().required().keys({
        name: Joi.string().required(),
          price: Joi.number().integer().required(),
    })
}

export const validationupdatestatus = {
    params: Joi.object().required().keys({
        _id: Joi.string().required().min(24).messages({
            "any.required": "noteId is required",
            "string.min":"id must be 24 characters"
        })
    })
}

export const validationsearchborrow = {
    body: Joi.object().required().keys({
        name: Joi.string().required().max(10).alphanum(),
    })
}