const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const data = req[source];
        const validatedData = schema.parse(data);

        // Replace the original data with the validated (and potentially transformed) data
        req[source] = validatedData;

        next();
    } catch (error) {
        if (error.name === 'ZodError' || error.issues) {
            res.status(400);
            const issues = error.issues || error.errors || [];
            const errorMessages = issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return next(new Error(JSON.stringify(errorMessages)));
        }
        next(error);
    }
};

module.exports = validate;
