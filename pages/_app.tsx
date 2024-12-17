import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from '../config/queryClient';
import Layout from "@/layouts/base"
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/config/stripe";
import { Toaster } from "@/components/ui/toaster"


export default function App({ Component, pageProps }: AppProps) {

    return (
        <QueryClientProvider client={queryClient}>
            <Elements stripe={stripePromise}>
                <Layout>
                    <Component {...pageProps} />
                    <ReactQueryDevtools initialIsOpen={false} />
                    <Toaster/>
                </Layout>
            </Elements>
        </QueryClientProvider>
  
    );
}
