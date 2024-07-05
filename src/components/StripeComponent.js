import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supportedCurrencies, API, getSymbol } from './../Stripe/StripeConstant'
import axios from "axios";
import './style.css'
import MultiLanguage from "./MultiLanguage";
import {createPaymentIntent } from  '../Stripe/StripeMethod'
export default function StripeComponent() {

    const [data, setData] = useState({ name: "", email: "", phone: "", amount: "", currency: 'usd' });

    const [showAmount, satShowAmount] = useState({ data: 0, symbol: 'USD' });

    const [errorMessage, setErrorMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [stripeElement, setStripeElement] = useState("");

    const [stripe, setStripe] = useState("");

    const { t } = useTranslation();


    useEffect(() => {
        let stripe = window.Stripe(process.env.REACT_APP_STRIPE_KEY)
        let elements = stripe.elements({ locale: "eg" });
        const cardElement = elements.create('card');
        setStripeElement(cardElement);
        setStripe(stripe);
        cardElement.mount('#cardElement');
    }, []);

    useEffect(() => { }, [errorMessage]);

    //------------------------------------ currency calculation ------------------------------------------------------//

    useEffect(() => {

        const currencyCode = window.geoplugin_currencyCode();
        const sbl = window.geoplugin_currencyCode();

        const element = document.getElementById('currency').lastElementChild;
        element.innerText = currencyCode.toUpperCase();
        element.value = currencyCode.toLowerCase();
        document.getElementById('currency').appendChild(element);


        setData((perv) => ({ ...perv, currency: currencyCode.toLowerCase() }));
        setData((perv) => ({ ...perv, symbol: sbl }));

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API);
                const base = data.currency.toUpperCase();
                const rate = response.data.rates[base];
                const converted = data.amount * rate;
                satShowAmount((prev) => ({ ...prev, data: Math.round(converted * 100) / 100, symbol: base }));
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchData();
    }, [data.amount, data.currency]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        if (!data.name || !data.email || !data.phone || !data.amount) {
            setErrorMessage("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        if (data.amount < 100) {
            setErrorMessage("Amount must be at least 100");
            setIsLoading(false);
            return;
        }

        if (data.amount > 1000000) {
            setErrorMessage("Exceeded card limit");
            setIsLoading(false);
            return;
        }


        if (supportedCurrencies.includes(data.currency.toLowerCase())) {


            try {

                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: stripeElement,
                    billing_details: {
                        name: data.name,
                        email: data.email,
                        phone: data.phone
                    },
                });


                if (error) {

                    setErrorMessage(error.message);

                } else {
                    await createPaymentIntent(data, paymentMethod);
                }

            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage(`Unsupported currency: ${data.currency}`);
            setIsLoading(false);
        }
    };




    return (
        <>
            <div>
                <MultiLanguage />
            </div>

            <div className="container" >
                <div className="cart-body">
                    <h2> {t('billing')} </h2>
                    <form id="paymentForm" onSubmit={handleSubmit} >
                        <label htmlFor="name"> {t('name')} </label>
                        <input type="text" id="name" name="Name" className="form-control" value={data.name} onChange={(e) => {
                            setErrorMessage("");
                            setData((prev) => ({ ...prev, name: e.target.value }))
                        }} />

                        <label htmlFor="email">{t('email')}</label>
                        <input type="email" id="email" name="email" className="form-control" value={data.email} onChange={(e) => {
                            setErrorMessage("");
                            setData((prev) => ({ ...prev, email: e.target.value }))
                        }} />

                        <label htmlFor="phone">{t('number')}</label>
                        <input type="number" id="phone" name="phone" className="form-control" value={data.phone} onChange={(e) => {
                            setErrorMessage("");
                            setData((prev) => ({ ...prev, phone: e.target.value }))
                        }} />



                        <label htmlFor="value">{t("amount")}</label>
                        <input id="amount" type="number" name="cardholder" className="form-control" value={data.amount} onChange={(e) => {
                            setErrorMessage("");
                            setData((prev) => ({ ...prev, amount: e.target.value }))
                        }} />


                        <label htmlFor="currency">{t('currency')}</label>
                        <select name="currency" id="currency" className="custom-select" value={data.currency} onChange={(e) => setData((prev) => ({ ...prev, currency: e.target.value }))}>
                            <option value="usd">USD</option>
                            <option value="eur">EUR</option>
                            <option value="gbp">GBP</option>
                            <option value="jpy">JPY</option>
                        </select>

                        <label className="mt-3" htmlFor="card-element">
                            {t('card')}
                        </label>

                        <div id="cardElement"></div>

                        <small className="form-text text-muted" id="cardErrors" role="alert"></small>

                        <input type="hidden" name="payment_method" id="paymentMethod" />

                        {isLoading ? (
                            <>
                                <input type="submit" value=" Loading ....." id="payButton" className={`btn btn-primary btn-lg`} />
                            </>
                        ) : (
                            <>
                                {errorMessage && <div className="error text-danger">{errorMessage}</div>}
                                <input type="submit"
                                    value={`${t('pay')} ${showAmount.data} ${getSymbol[showAmount.symbol] ? getSymbol[showAmount.symbol] : ''}`}
                                    id="payButton" className={`btn btn-primary btn-lg`}
                                />
                            </>
                        )}


                    </form>
                </div>

            </div>
        </>
    )

}                    