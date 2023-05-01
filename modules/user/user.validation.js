import Joi from "joi";

export const signupValidation = {
    body: Joi.object().required().keys({
        name: Joi.string().required().min(5).max(10).alphanum().messages({
            "string.min": "Name must be at least 5 characters",
          }),
          email: Joi.string().required().messages({
            "string.email": "Email format invalid",
            "any.required": "email is required",
          }),
          phoneNumber: Joi.number().integer().required(),
          password: Joi.string().required().pattern(
            new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)
          )
          .messages({
            "string.pattern.base": "password must contains number and symbols",
          }),
          cpass: Joi.string().required().valid(Joi.ref("password")).messages({
            "any.only": "cpass must match password",
          }),
    })
}


export const signInValidation = {
  body: Joi.object().required().keys({
        email: Joi.string().required().messages({
          "string.email": "Email format invalid",
          "any.required": "email is required",
        }),
        password: Joi.string().required().pattern(
          new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)
        )
        .messages({
          "string.pattern.base": "password must contains number and symbols",
        }),
  })
}


export const forgetValidation ={
  body: Joi.object().required().keys({
    email: Joi.string().required().messages({
      "string.email": "Email format invalid",
      "any.required": "email is required",
    }),
  })
}


export const changepassValidation = {
  body: Joi.object().required().keys({
    email: Joi.string().required().messages({
      "string.email": "Email format invalid",
      "any.required": "email is required",
    }),
    password: Joi.string().required().pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)
    )
    .messages({
      "string.pattern.base": "password must contains number and symbols",
    }),
})
}


export const changeUserPass = {
  body: Joi.object().required().keys({
    password: Joi.string().required().pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)
    )
    .messages({
      "string.pattern.base": "password must contains number and symbols",
    }),
    newpass: Joi.string().required().pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)
    )
    .messages({
      "string.pattern.base": "password must contains number and symbols",
    }),
})
}