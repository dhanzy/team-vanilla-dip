const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const Contest = require('../models/Contest');
const User = require('../models/User');
const StripeCustomer = require('../models/StripeCustomer');

//charge customer off session
exports.chargeCustomer = asyncHandler(async (req, res) => {
  const { contestID } = req.params;
  const userID = req.user.id;
  try {
    const contest = await Contest.findById(contestID);
    const [stripeCustomer] = await StripeCustomer.find({ userID });

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomer.stripeCustomerID,
      type: 'card',
    });

    await stripe.paymentIntents.create({
      amount: contest.prizeAmount * 100,
      currency: 'cad',
      customer: stripeCustomer.stripeCustomerID,
      payment_method: paymentMethods.data[paymentMethods.data.length - 1].id,
      off_session: true,
      confirm: true,
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    if (error.code === 'authentication_required') {
      const paymentIntent = await stripe.paymentIntents.retrieve(error.raw.payment_intent.id);
      return res.status(401).json({ payment_intent: paymentIntent });
    }
  }
});

//create a customer
exports.createCustomer = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  const [stripeCustomer] = await StripeCustomer.find({ userID });

  if (stripeCustomer) {
    return res.status(200).json({
      existingStripeCustomer: true,
    });
  }
  try {
    const user = await User.findById(userID);

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
    });

    const cardSetup = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      customer: customer.id,
    });

    const newStripeCustomer = new StripeCustomer({
      stripeCustomerID: customer.id,
      userID,
      cardSetupID: cardSetup.id,
    });

    await newStripeCustomer.save();

    res.status(201).json({
      existingStripeCustomer: false,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

exports.getSetupIntent = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  const [stripeCustomer] = await StripeCustomer.find({ userID });

  if (!stripeCustomer) {
    return res.status(404).json({ error: 'No Customer found' });
  }

  try {
    const intent = await stripe.setupIntents.retrieve(stripeCustomer.cardSetupID);

    res.status(200).json({ intent_secret: intent.client_secret });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
