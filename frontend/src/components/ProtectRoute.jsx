import { Outlet,Navigate } from "react-router-dom"

export const SecureDashboardRoute = () => {
    let cookieExists=document.cookie.includes("token")
    return(
        <>
        {cookieExists ? <Outlet/> : <Navigate to="/login"/>}
        </>
    )
}
export const SecureLogin = () => {
    let cookieExists=document.cookie.includes("token")
    return(
        <>
        {!cookieExists ? <Outlet/> : <Navigate to="/chat"/>}
        </>
    )
}
