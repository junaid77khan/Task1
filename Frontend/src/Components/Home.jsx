import Header from "./Header";

function Home() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
                <div className="text-center bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h1 className="text-4xl font-semibold text-gray-800 mb-4">
                        Welcome to Admin Panel
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage your system settings and user data from here.
                    </p>
                </div>
            </div>
        </>
    );
}

export default Home;
