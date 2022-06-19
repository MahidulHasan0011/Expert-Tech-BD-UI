//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/dist/angular-ui/browser'));

app.post('/callback/payment/cancel', (req, res) => {

  res.redirect(301, "https://www.experttechbd.com/payment/cancel");
  // console.log(req.body);
  // res.status(200).json({
  //   data: req.body,
  //   message: 'Data Retrieved Successfully!'
  // });

})

app.post('/callback/payment/success', (req, res) => {

  res.redirect(301, "https://www.experttechbd.com/payment/success");
  // console.log(req.body);
  // res.status(200).json({
  //   data: req.body,
  //   message: 'Data Retrieved Successfully!'
  // });

})

app.post('/callback/payment/fail', (req, res) => {

  res.redirect(301, "https://www.experttechbd.com/payment/fail");
  // console.log(req.body);
  // res.status(200).json({
  //   data: req.body,
  //   message: 'Data Retrieved Successfully!'
  // });

})

app.get('*', function (req, res) {
  // Replace the '/dist/<to_your_project_name>/index.html'
  res.sendFile(path.join(__dirname + '/dist/angular-ui/browser/index.html'));
});

// For Main Server..
const port = process.env.PORT || 4003;
app.listen(port, () => console.log(`Server is running at port:${port}`));
