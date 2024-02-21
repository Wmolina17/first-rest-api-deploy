const z = require("zod")

const schema = z.object({
    title: z.string({
        invalid_type_error: "movie title must be a string",
        required_error: "movie title is required",
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10),
    poster: z.string().url(),
    genre: z.array(z.string()),
})

function validateMovie(object) {
    return schema.safeParse(object)
}

function validatePartialMovie(object) {
    return schema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}