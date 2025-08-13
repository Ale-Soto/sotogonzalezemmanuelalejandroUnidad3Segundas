import mongoose from 'mongoose'

export const connectDB = async () => {

 try {
  await mongoose.connect('mongodb+srv://lista:lista1701@clusterpusho.jwii4a5.mongodb.net/lista?retryWrites=true&w=majority&appName=ClusterPusho')
  console.log(">>>DB is connected")
 } catch (error) {
  console.log(error)
 }
}