const express = require("express")
const moviesJson = require("./movies.json")
const cors = require("cors")
const crypto = require("node:crypto")
const { validateMovie, validatePartialMovie } = require("./schemas/movies")

const app = express()
app.use(express.json())
app.use(cors())
app.disable("x-powered-by")

app.get("/", (req, res) => {
    res.json({ message: "hola mundo" })
})

app.get("/movies", (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filteredMovies = moviesJson.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(moviesJson)
})

app.delete("/movies/:id", (req, res) => {
    const { id } = req.params
    const movieIndex = moviesJson.findIndex(movie => movie.id == id)

    if (movieIndex == -1) {
        return res.status(404).json({ message: "movie not found" })
    }

    moviesJson.splice(movieIndex, 1)
    return res.json({ message: "movie deleted" })
})

app.get("/movies/:id", (req, res) => {
    const { id } = req.params
    const movies = moviesJson.find(movie => movie.id == id)
    if (movies) return res.json(movies)
    res.status(404).json({ message: "movie not found" })
})

app.post("/movies", (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newMovie = {
        id: crypto.randomUUID(),
        ...result(data)
    }
    moviesJson.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch("/movies/:id", (req, res) => {
    const result = validatePartialMovie(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const movieIndex = moviesJson.findIndex(movie => movie.id == id)
    if (movieIndex === -1) return res.status(404).json({ message: "movie not found" })

    const updateMovie = {
        ...moviesJson[movieIndex],
        ...result.data
    }

    moviesJson[movieIndex] = updateMovie

    return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})