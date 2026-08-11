import NavbarComponent from "@/components/Navbar";
import React from "react";

export default function UserLayout({children}){
    return(
        <div>
            <NavbarComponent></NavbarComponent>
            {children}
        </div>
    )
}