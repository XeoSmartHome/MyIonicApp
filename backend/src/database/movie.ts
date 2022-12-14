import mongoose from "mongoose";

interface IMovie {
    title: string;
    year: number;
    description: string;
    actors: string[];
    location: string;
}

const movieSchema = new mongoose.Schema<IMovie>({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    description: {type: String, required: true},
    actors: {type: [String], required: true},
    location: {type: String, required: true},
});

export const Movie = mongoose.model<IMovie>("Movie", movieSchema);
