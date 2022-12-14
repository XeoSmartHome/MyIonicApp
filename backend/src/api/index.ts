import express, {Router} from "express";
import {User} from "../database/user";
import {createHash} from "crypto";
import {Movie} from "../database/movie";
import {sign, verify} from "jsonwebtoken";
import {getIo} from "../connections";

export const APP_SECRET = "secret1234";
const generateJwtToken = (userId: string) => {
    return sign({userId}, APP_SECRET, {expiresIn: "10d"});
}

const notifyUser = (userId: string) => {
    const io: any = getIo();
    if(io) {
        io.to(userId).emit("update");
    }
};

const mapMovie = (movie: any) => {
    return {
        id: movie._id,
        title: movie.title,
        description: movie.description,
        year: movie.year,
        location: movie.location,
        poster: movie.poster,
    }
}

const apiRouter = Router();
apiRouter.use(express.json());

const authMiddleware = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send();
    }
    try {
        const decoded = verify(token, APP_SECRET);
        const {userId} = decoded as { userId: string };
        if (!userId) {
            return res.status(401).send();
        }
        res.locals = {userId};
        next();
    } catch (e) {
        return res.status(401).send();
    }
}

apiRouter.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return res.status(401).json({message: "User not found"});
    }

    const passwordHash = createHash("sha256").update(req.body.password).digest("hex");

    if (passwordHash !== user.passwordHash) {
        return res.status(401).json({message: "Invalid password"});
    }

    res.send({
        token: generateJwtToken(user.id),
    })
});

apiRouter.post("/users", (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({message: "Missing required fields"});
    }

    const user = new User({
        email,
        firstName,
        lastName,
        passwordHash: createHash('sha256').update(password).digest('hex'),
    });

    user.save().then((user) => {
        res.send(user);
    }).catch((error) => {
        console.log("error", error);
        res.sendStatus(500);
    });
});


apiRouter.get("/movies", authMiddleware, async (req, res) => {
    const {userId} = res.locals;
    const movies = await Movie.find({userId}, {}, {limit: 10003});
    res.send({
        movies: movies.map(mapMovie),
        nextMovieId: movies.length > 0 ? movies[movies.length - 1]._id : null,
    });
});

apiRouter.post("/movies", authMiddleware, (req, res) => {
    const {userId} = res.locals;

    const {title, description, year, date, location} = req.body;

    if (!title || !description || !year || !date || !location) {
        return res.status(400).json({message: "Missing required fields"});
    }

    const movie = new Movie({
        userId,
        title,
        description,
        year,
        date,
        poster: "default",
        location,
    });

    movie.save().then((movie) => {
        res.send(mapMovie(movie));
        notifyUser(userId);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

apiRouter.put("/movies/:movieId", authMiddleware, (req, res) => {
    const {userId} = res.locals;

    const {title, description, year, date, location} = req.body;

    if (!title || !description || !year || !date || !location) {
        console.log("error", "Missing required fields");
        return res.status(400).json({message: "Missing required fields"});
    }

    Movie.updateOne({
        userId,
        _id: req.params.movieId,
    }, {
        title,
        description,
        year,
        date,
        location,
    }).then((movie) => {
        res.send(mapMovie(movie));
        notifyUser(userId);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

apiRouter.delete("/movies/:movieId", authMiddleware, (req, res) => {
    const {userId} = res.locals;

    Movie.deleteOne({
        userId,
        _id: req.params.movieId,
    }).then((movie) => {
        res.send(mapMovie(movie));
        notifyUser(userId);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

export default apiRouter;
