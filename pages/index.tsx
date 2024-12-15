import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import propertyService from "@/services/propertyService";

export default function Home() {
    const loadMoreRef = useRef(null);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["all-properties"],
        queryFn: async ({ pageParam = 1 }) => {
            return propertyService.getAllProperty(pageParam);
        },
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1, 
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, hasNextPage, fetchNextPage]);

    return (
        <div className="w-[96%] mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Properties</h1>
            {isLoading ? (
                <p>Loading properties...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.pages?.map((page, pageIndex) =>
                        page.results.map((property, propertyIndex) => (
                            <div
                                key={`${pageIndex}-${propertyIndex}`}
                                className="border p-4 rounded shadow-md"
                            >
                                <h2 className="text-xl font-semibold">{property.name}</h2>
                                <p className="text-gray-600">{property.description}</p>
                                <p className="font-bold text-lg">${property.price_per_night}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )

}
    
