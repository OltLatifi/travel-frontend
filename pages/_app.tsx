import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from '../config/queryClient';
import Layout from "@/layouts/base"


export default function App({ Component, pageProps }: AppProps) {

    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
            </Layout>
        </QueryClientProvider>
  
    );
}
