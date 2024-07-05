import React, { useEffect, useState } from 'react';
import { paymentPlatforms, plans } from '../Stripe/StripeConstant';
import { toast } from 'react-toastify';
import { CreateACustomar } from '../Stripe/StripeMethod';



const Subscription = () => {

  const [stripeElement, setStripeElement] = useState("");

  const [stripe, setStripe] = useState("");



  const [state, setState] = useState({
    selectedPlan: '',
    selectedPlatform: ''
  });


  useEffect(() => {
    let stripe = window.Stripe(process.env.REACT_APP_STRIPE_KEY)
    let elements = stripe.elements({ locale: "eg" });
    const cardElement = elements.create('card');
    setStripeElement(cardElement);
    setStripe(stripe);
    cardElement.mount('#cardElement');
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault()

    try {

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: stripeElement,
        billing_details: {
          name: "",
          email: "",
          phone: ""
        },
      });
      if (error) {
        toast.error(error.message);
      } else {

        let plan = plans.find(({ title }) => state.selectedPlan === title);
        plan = plan.features[0].toUpperCase();
        if (state.selectedPlatform === '2') await CreateACustomar(paymentMethod ,plan);
        else toast.error("paypal is not available");
      }

    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Subscribe</div>
            <div className="card-body">
              <form onSubmit={handelSubmit} id="paymentForm">
                <div className="row mt-3">
                  <div className="col">
                    <label>Select your plan</label>
                    <div className="form-group">
                      <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        {plans.map((plan) => (
                          <label
                            key={plan.title}
                            className={`btn btn-outline-info rounded m-2 p-3 ${state.selectedPlan === plan.title ? 'active' : ''
                              }`}
                          >
                            <input
                              type="radio"
                              name="plan"
                              value={plan.title}
                              required
                              onChange={(e) => setState((perv) => ({ ...perv, selectedPlan: e.target.value }))}
                              checked={state.selectedPlan === plan.title}
                            />
                            <p className="h2 font-weight-bold text-capitalize">{plan.title}</p>
                            {plan.features.map((feature, ind) => (
                              <p key={ind} className=" text-capitalize">{feature}</p>
                            ))}

                            <p className="display-4 text-capitalize">{plan.price.slice(1)}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <label>Select the desired payment platform</label>
                    <div className="form-group" id="toggler">
                      <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        {paymentPlatforms.map((platform) => (
                          <label
                            key={platform.id}

                            data-target={`#${platform.name}Collapse`}
                            data-toggle="collapse"
                            className={`btn btn-outline-success rounded m-1 p-2 ${state.selectedPlatform === platform.id ? 'active' : ''
                              }`}
                          >
                            <input
                              type="radio"
                              name="payment_platform"
                              value={platform.id}
                              required
                              onChange={(e) => setState((perv) => ({ ...perv, selectedPlatform: e.target.value }))}
                              checked={state.selectedPlatform === platform.id}
                            />
                            <img
                              className="img-thumbnail"
                              width="60" height="50"
                              src={platform.image}
                              alt={platform.name}
                            />
                          </label>
                        ))}
                      </div>

                      <div>
                        <label className='mt-2 mb-2'>Enter Card number</label>
                        <div id="cardElement" ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button type="submit" id="payButton" className="btn btn-primary btn-lg">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )




}

export default Subscription;
