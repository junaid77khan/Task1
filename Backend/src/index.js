import dotenv from 'dotenv'
import connnectDB from "./db/index.js"
import { app } from './maincode.js'

dotenv.config()

connnectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Error : ", error)
        throw error        
    })

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })    
})
.catch((err) => {
    console.log("MongoDB Connection Failed!!!...", err)
})