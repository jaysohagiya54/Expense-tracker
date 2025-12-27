const { z } = require('zod');

const userIdParamSchema = z.object({
    userId: z.string().regex(/^\d+$/).transform(Number),
});

module.exports = {
    userIdParamSchema,
};
