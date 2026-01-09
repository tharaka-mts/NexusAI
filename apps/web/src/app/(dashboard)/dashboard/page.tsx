import NavBar from "@/components/ui/NavBar";

const DashboardPage = () => {
    return (
        <div>
            <NavBar />
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-muted-foreground">Welcome to your dashboard.</p>
        </div>
    )
}

export default DashboardPage;