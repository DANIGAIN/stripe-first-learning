import paypalImage  from '../asset/PayPal-Logo.png';
import stripeImage from '../asset/stripe.png';

export const API  =  "https://api.exchangerate-api.com/v4/latest/USD" ; 

export const supportedCurrencies = ['usd', 'eur', 'gbp', 'jpy'];

export const getSymbol = {
    'USD' : '$', 
    'EUR' : '€', 
    'GBP' : '£', 
    'JPY' : '¥',
    'BDT': 'tk'
}

export const plans = [
    {
        title: "Premium Plan",
        price: "$999.00",
        features: [
            "Yearly",
            "Unlimited Access",
            "HD Quality",
            "Offline Downloads",
            "Cancel Anytime"
        ],
        buttonColor: "primary"
    },
    {
        title: "Standard Plan",
        price: "$099.00",
        features: [
            "Monthly",
            "Limited Access",
            "Standard Quality",
            "No Downloads",
            "Cancel Anytime"
        ],
        buttonColor: "success"
    },
    {
        title: "Basic Plan",
        price: "$009.00",
        features: [
            "Daily",
            "Medium Access",
            "High Quality",
            "Limited Downloads",
            "Cancel Anytime"
        ],
        buttonColor: "warning"
    }
];

export const paymentPlatforms = [
    {
        id:'1',
        name:'paypal',
        image:paypalImage
    },
    {
        id:'2',
        name:'stripe',
        image:stripeImage
    }
] 