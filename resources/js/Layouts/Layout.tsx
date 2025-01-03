import Footer from "@/Components/MyComponents/Footer";
import Navbar from "@/Components/MyComponents/Navbar";
import React from "react";

// TODO: Fix Layout that it wouldn't show on /login / register etc. pages

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
