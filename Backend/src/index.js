import dotenv from 'dotenv'
import connnectDB from "./db/index.js"
import { app } from './App.js'

// Update env path to be relative to project root
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