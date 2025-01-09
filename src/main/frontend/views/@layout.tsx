import {NavLink, Outlet} from "react-router-dom";

export default function layout(){

    return (
        <div className="p-m">
            <nav>
                <NavLink className="btn btn-outline-info m-1" to="/">Home</NavLink>
                <NavLink className="btn btn-outline-info m-1" to="/chat">Chat</NavLink>
                <NavLink className="btn btn-outline-info m-1" to="/fileUpload">File Upload</NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}