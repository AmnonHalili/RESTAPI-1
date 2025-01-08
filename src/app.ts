import dotenv from "dotenv";
dotenv.config();
import initApp from "./server";

const port = process.env.PORT;

initApp().then((app) => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
 