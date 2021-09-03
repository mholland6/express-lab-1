import cartItem from "../models/cartItem";

// require the express module
import express from "express";
 
// create a new Router object
const cartRouter = express.Router();
 
export default cartRouter;
 

const cartItems: cartItem[] = [
  { id: 1, product: "Ham"    , price: 8.00, quantity: 1 },
  { id: 2, product: "Turkey" , price: 7.00, quantity: 2 },
  { id: 3, product: "Salami" , price: 9.00, quantity: 3 },
  { id: 4, product: "Bologna", price: 3.00, quantity: 4 }
];
let nextId: number = 5;

// 1. GET /cart-items, and maxPrice, prefix, pageSize
cartRouter.get("/cart-items", (req, res) => {
  const maxPrice: number = parseInt(String(req.query.maxPrice));
  const prefix: string = req.query.prefix as string;
  const pageSize: number = parseInt(String(req.query.pageSize));

  if (maxPrice) {
    // send just the items at or below this price
    const filteredItems = cartItems.filter(thisItem => thisItem.price <= maxPrice);
    res.json(filteredItems); 
  } else if (prefix) {
    const filteredItems = cartItems.filter(thisItem => thisItem.product.includes(prefix));
    res.json(filteredItems);
  } else if (pageSize) {
    res.json(cartItems.slice(0, pageSize));
  } else {
    res.json(cartItems);
  }
});


// 2. GET /cart-items
cartRouter.get("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const cartItem: cartItem | undefined = cartItems.find(thisItem => thisItem.id === id);
  if (cartItem) {
    res.json(cartItem);
  } else {
    res.status(404);
    res.send(`No item with the id ${id}.`)
  }
});

// 3. POST /cart-items
cartRouter.post("/cart-items", (req, res) => {
  const newItem: cartItem = req.body;
  newItem.id = nextId++
  cartItems.push(newItem);
  // send back confirmation
  res.status(201);
  res.json(newItem);
});

// 4. PUT /cart-items/:id
cartRouter.put("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const item: cartItem = req.body;
  item.id = id;

  const itemIndex: number = cartItems.findIndex(thisItem => thisItem.id === id);
  if (itemIndex !== -1) {
    cartItems[itemIndex] = item; // replacing it with this line
    res.json(item);
  } else {
    res.status(404);
    res.send(`No item exists with id ${id}`);
  }
});

// 5. DELETE /cart-items/:id
cartRouter.delete("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const itemIndex: number = cartItems.findIndex(thisItem => thisItem.id === id);
  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1) // deleting it with this line
    res.status(204);
    res.send();
  } else {
    res.status(404);
    res.send(`No item exists with id ${id}`);
  }
});