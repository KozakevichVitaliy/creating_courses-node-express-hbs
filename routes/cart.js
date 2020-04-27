const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const Course = require('../models/courseDB');
// const Cart = require('../models/cart');

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
}

function computePrice(courses) {
  return courses.reduce((acc, course) => {
    return (acc += course.price * course.count);
  }, 0);
}

router.post('/add', auth,  async (req, res) => {
  const course = await Course.findById(req.body.id);
  // await Cart.add(course);
  await req.user.addToCart(course);
  res.redirect('/cart');
});

router.get('/', auth,  async (req, res) => {
  // const cart = await Cart.fetch();
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartItems(user.cart);
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses,
    price: computePrice(courses),
  });
});

router.delete('/remove/:id', auth, async (req, res) => {
  // const cart = await Cart.remove(req.params.id);
  console.log(req.params.id);
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart);
  const cart = {
    courses,
    price: computePrice(courses),
  };
  res.status(200).json(cart);
});

module.exports = router;