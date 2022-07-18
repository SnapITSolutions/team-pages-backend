import joi from 'joi';

export const avgOptString = joi.string()
  .max(50)
  .trim()
  .optional();

export const avgParagraph = joi.string()
  .max(2000)
  .trim()
  .required();

export const avgOptParagraph = joi.string()
  .max(2000)
  .trim()
  .optional();

export const avgString = joi.string()
  .max(50)
  .trim()
  .required();

export const avgLink = joi.string()
  .pattern(/[A-z0-9.-_]/)
  .max(50)
  .trim()
  .lowercase()
  .optional();

const memberData = joi.object({
  // Personal
  firstName: avgString,
  lastName: avgString,
  jobLikes: avgParagraph,
  interests: avgParagraph,
  pronouns: avgOptString,
  // Job
  title: avgString,
  startYear: joi.number()
    .min(2005)
    .max(3000)
    .integer()
    .positive()
    .required(),
  wasApprentice: joi.boolean()
    .required(),
  // Socials
  linkedin: avgLink,
  github: avgLink,
  youtube: avgLink,
  instagram: avgLink,
  personal: joi.string()
    .optional()
    .uri(),
});

export default memberData;
