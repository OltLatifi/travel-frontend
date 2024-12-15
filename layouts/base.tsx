import Navbar from "@/components/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <>
            
            <Navbar/>
            <main className="max-w-5xl mx-auto px-4 w-full">
                {children}
            </main>
        </>
    )
  }
  