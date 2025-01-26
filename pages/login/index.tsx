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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/userService";
import router from "next/router";
import useUserStore from "@/stores/userStore";
import Link from "next/link";

const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string(),
});

export default function LoginForm() {
    const queryClient = useQueryClient();
    const { setIsLoggedIn } = useUserStore()

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
        mutation.mutate(values, {
            onSuccess: () => {
                setIsLoggedIn(true)
                router.push("/")
            },
            onError: (error) => {
                form.setError("password", { message: "Invalid username or password" });
            }
        });
    }

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="JohnDoe" 
                                            {...field}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" 
                                        />
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
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="password"
                                            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full py-2 bg-primary hover:bg-primary/90 transition-colors"
                        >
                            Sign in
                        </Button>
                        <div className="flex justify-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?
                            </p>
                            <Link href="/register" className="ml-2 text-sm text-primary hover:text-primary/90 transition-colors">
                                Register here
                            </Link>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
