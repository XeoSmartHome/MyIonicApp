import {Router} from "express";

const apiRouter = Router()

apiRouter.post("/accounts", (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
});

export default apiRouter;
