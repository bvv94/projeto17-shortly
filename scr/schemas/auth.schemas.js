import joi from joi;

export const userSchema = joi.object({
    name: joi.string(). required,
    email: joi.string(). required,
    pasword: joi.string(). required
})
export const loginSchema = joi.object({
    email: joi.string(). required,
    pasword: joi.string(). required
})