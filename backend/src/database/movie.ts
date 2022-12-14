import mongoose from "mongoose";

interface IMovie {
    userId: string;
    title: string;
    year: number;
    description: string;
    location: string;
}

const movieSchema = new mongoose.Schema<IMovie>({
    userId: { type: String, required: true },
    title: {type: String, required: true},
    year: {type: Number, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
});

export const Movie = mongoose.model<IMovie>("Movie", movieSchema);
