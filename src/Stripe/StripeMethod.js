import axios from "axios";

import db from '../firebase';
import { addDoc, collection, updateDoc ,doc} from 'firebase/firestore';
import { toast } from 'react-toastify';

// axios
export const axiosClient = axios.create();

axiosClient.defaults.baseURL = 'https://api.stripe.com/v1';
axiosClient.defaults.headers = {
  Authorization:
    "Bearer " +
    process.env.REACT_APP_STRIPE_SECRET_KEY,
  "Content-Type": "application/x-www-form-urlencoded",
};
// axios
const confirmPaymentIntent = async (response) => {

  await axiosClient.post('/payment_intents/' + response.data.id + '/confirm')
  .then(function(res){
    console.log(res);
    alert("success");

  }).catch(function(err){
    return err ;
  })
}


export const createPaymentIntent = async (data , paymentMethod) => {


await axiosClient
  .post(
    "/payment_intents",
    {
      amount: data.amount,
      currency: data.currency,
      payment_method: paymentMethod.id,
      confirmation_method: "automatic",
    }
  )
  .then(function (response) {
    return confirmPaymentIntent(response, paymentMethod);
  })
  .catch(function (error) {
    return error;
  });


}

//---------------------------------------- Subscription system  ------------------------------//

const getEnvPathValue = (plan) =>{
  if(plan === "YEARLY") return process.env.REACT_APP_PEACH_PRODUCT_ID_YEARLY;
  else if(plan === "MONTHLY") return process.env.REACT_APP_PEACH_PRODUCT_ID_MONTHLY;
  else  return process.env.REACT_APP_PEACH_PRODUCT_ID_DAILY;
}

const createSubcription = async (customerId, paymentMethod ,plan) => {

  const userCollectionRef = collection(db , 'User');
  
  var date = new Date();
  let trial_end_date = Math.round(+date.setDate(date.getDate() + 10)/1000);

  try {
    
    const response = await axiosClient.post('/subscriptions', {
      customer: customerId,
      items: [
        { price: getEnvPathValue(plan)},
      ],
      default_payment_method: paymentMethod.id,
      cancel_at_period_end: true,
      trial_end: trial_end_date

    });

    toast.success("Successfuly Subscried");
    console.log(response.data)
    //----------------------------------------- store fierbase ----------------------------------//
    const data = {
      CustomerId: response.data.customer,
      SubscriptionId: response.data.id, 
      status:response.data.status
    };
    await addDoc(userCollectionRef ,  data);

    //----------------------------------------------------------------------------------------------//
  } catch (error) {
    throw error ; 
  }
}

export const CreateACustomar = async (paymentMethod ,plan) => {
  try {

    const response = await axiosClient.post("/customers", {
      payment_method:paymentMethod.id,
    });

    await createSubcription(response.data.id , paymentMethod , plan);
  } catch (error) {
    throw error;
  }
};


/// --------------------------------------------------- delete a substription --------------//

export const handelSubscriptionCancel = async(id , SubscriptionId)=>{
  const res = await axiosClient.delete(`/subscriptions/${SubscriptionId}`);
  
  //update fierbase --->
  await updateDoc(doc(db ,'User', id) , {'status': res.data.status});
}

export const handelSubscriptionResume = async(id , SubscriptionId) =>{

  const res = await axiosClient.post(`/subscriptions/${SubscriptionId}/resume `,{billing_cycle_anchor: 'now'});

  console.log(res.data);
  
  //update fierbase --->
 // await updateDoc(doc(db ,'User', id) , {'status': res.data.status});
}
export  const  handelSubscriptionRetrieve = async(id , SubscriptionId)=>{

  const res = await axiosClient.get(`/subscriptions/${SubscriptionId}`);
  await updateDoc(doc(db ,'User', id) , {'status': res.data.status});
  console.log(res.data);
}

//------------------------------------------------- stripe check Out ---------------------------------------//

//------------>> check out for one time 

// export const stripeCheckOut = async (quantity) => {
//   const session = await axiosClient.post('/checkout/sessions', {
//     success_url:`http://localhost:3000/success/id={CHECKOUT_SESSION_ID}`,
//     cancel_url:'http://localhost:3000',
//     mode:'payment',
//     line_items:[{ 
//       quantity,
//       currency: 'USD',
//       amount: 1000,
//       name: 'test product'
//     }],

//   });
//   return session.data;
// }


//------------>> check out for substription  

export const stripeCheckOut = async (quantity) => {
  const session = await axiosClient.post('/checkout/sessions', {
    success_url:`http://localhost:3000/success/id={CHECKOUT_SESSION_ID}`,
    cancel_url:'http://localhost:3000',
    mode:'subscription',
    line_items:[{ 
      quantity,
      price:process.env.REACT_APP_PEACH_PRODUCT_ID
    }],

  });
  return session.data;
}