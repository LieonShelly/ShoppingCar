var  Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var product = new Product();
product.imagePath  = 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png';
product.title = 'video game';
product.description = 'awsome game';
product.price = 10;
var product1 = new Product();
product1.imagePath  = 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png';
product1.title = 'video game';
product1.description = 'awsome game';
product1.price = 11;
var product2 = new Product();
product2.imagePath  = 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png';
product2.title = 'video game';
product2.description = 'awsome game';
product2.price = 12;
var product3 = new Product();
product3.imagePath  = 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png';
product3.title = 'video game';
product3.description = 'awsome game';
product3.price = 13;
var products = [product, product1, product2, product3];
var done = 0;
for (var i = 0; i < products.length; i++){
  products[i].save(function(err, result){
      if(err){
          console.log("error");
      } else {
          done ++;
          console.log(result);
          if (done === products.length) {
              exit();
          }
      }
  });
}

function exit() {
    console.log('cloed');
    mongoose.disconnect();
}