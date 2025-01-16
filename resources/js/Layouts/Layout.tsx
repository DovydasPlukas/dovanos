import Footer from "@/Components/MyComponents/Footer";
import Navbar from "@/Components/MyComponents/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
