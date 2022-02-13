import * as Joi from "joi";

const transferValidator = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    reciverMail: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),

    points: Joi.number().min(1).required(),
  });
  const { error } = schema.validate(req.body);

  if (error?.message) {
    return res
      .status(400)
      .json({ message: error.message, errorKey: error?.details[0].path[0] });
  }
  next();
};
export default transferValidator;
