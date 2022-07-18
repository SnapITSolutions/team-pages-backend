import joi from 'joi';
import * as md from './memberdata';

const avgParagraph = joi.string()
  .max(2000)
  .trim()
  .required();

const avgLink = joi.string()
  .pattern(/[A-z0-9.-_]/)
  .max(50)
  .trim()
  .lowercase()
  .optional();

const memberUpdateData = joi.object({
  // Personal
  firstName: md.avgOptString,
  lastName: md.avgOptString,
  jobLikes: md.avgOptParagraph,
  interests: md.avgOptParagraph,
  pronouns: md.avgOptString,
  // Job
  title: md.avgOptString,
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

export default memberUpdateData;
