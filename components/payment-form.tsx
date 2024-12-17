// components/PaymentForm.tsx
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useState } from "react";
import Axios from "@/config/axiosInstance";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
        return; // Stripe.js hasn't loaded yet
        }

        const cardElement = elements.getElement(CardElement) as StripeCardElement;

        setIsProcessing(true);

        // Fetch the client_secret from the backend
        const response = await fetch('http://localhost:8000/api/payments/create-payment-intent/', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1000 }), // Example: $10.00 in cents
        });

        const data = await response.json();
        const clientSecret = data.client_secret

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
            name: "Customer Name",
            },
        },
        });

        if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded!");
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
        <CardElement
        options={{
            style: {
            base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                color: "#aab7c4",
                },
            },
            invalid: {
                color: "#fa755a",
            },
            },
        }}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
        </button>
        </form>
    );
};

export default PaymentForm;
