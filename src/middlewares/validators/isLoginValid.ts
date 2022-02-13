import * as Joi from "joi";

const loginValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),

    password: Joi.string().min(6).max(30).required(),
  });
  const { error } = schema.validate(req.body);

  if (error?.message) {
    return res
      .status(400)
      .json({ message: error.message, errorKey: error?.details[0].path[0] });
  }
  next();
};
export default loginValidator;
