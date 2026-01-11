const sadieRoute=app.get('/', (req, res) => {
  res.send('Sadie Mayes');
});

const angelRoute=app.get('/', (req, res) => {
  res.send('Angel Mayes');
});

module.exports={
    sadieRoute, 
    angelRoute
    };