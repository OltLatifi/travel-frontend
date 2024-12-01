import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useMutation, useQuery } from "@tanstack/react-query"
import flightService from "@/services/flightService"
import userService from "@/services/userService"
import { useEffect } from "react"
import router from "next/router"

const formSchema = z.object({
    code: z.string().min(3).max(4),
    name: z.string().min(2).max(50),
    city: z.string().min(2).max(50),
    country: z.string().min(2).max(50),
})

export default function AirportForm() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["user", "me"],
        queryFn: userService.fetchUser,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    useEffect(() => {
        if (!isLoading && !isError && data) {
            if(data.user_type !== "Staff"){
                router.push("/")
            }
        }
    }, [isLoading, isError, data]);

    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            name: "",
            city: "",
            country: "",
        },
    })

    const mutation = useMutation({
        mutationFn: flightService.createAirport,
        onSuccess: (response) => {
            console.log(response)
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values)
    }

    return(
        <Card className="max-w-2xl w-[96%] mx-auto p-8 rounded-md mt-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                            <Input placeholder="PRN" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Prishtina International Airport"  {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="Prishtina"  {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input placeholder="Kosove"  {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </Card>
    )
}