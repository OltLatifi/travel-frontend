import { useQuery } from "@tanstack/react-query";
import userService from "@/services/userService";
import { useRouter } from "next/router";
import { ComponentType, useEffect } from "react";

export function withAuthGuard<P extends {}>(
  WrappedComponent: ComponentType<P>,
  requiredRole: string
) {
  return function AuthGuardedComponent(props: P) {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["user", "me"],
      queryFn: userService.fetchUser,
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isError && data) {
            if (data.user_type !== requiredRole) {
                router.push("/");
            }
        }
        if(!isLoading && !isError && !data) {
            router.push("/login")
        }
    }, [isLoading, isError, data, requiredRole, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }


    return <WrappedComponent {...props} />;
  };
}
