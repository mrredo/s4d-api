
module.exports = (pass,  mongoose) => {
    mongoose
    .connect(pass, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false,
    })
    .then(
      console.log(`Connected the API to Mongo DB`))
    .catch((err) =>{
      console.log(`Couldn't connect the API to Mongo DB`);
      console.log(err);
      });
};