import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/userService";
import { useEffect } from "react";
import router from "next/router";

const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string(),
});

export default function LoginForm() {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: userService.logIn,
        onSuccess: (response) => {
            localStorage.setItem("accessToken", response.access);
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
        router.push("/")
    }

    return (
        <Card className="max-w-2xl w-[96%] mx-auto p-8 rounded-md mt-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="JohnDoe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </Card>
    );
}
