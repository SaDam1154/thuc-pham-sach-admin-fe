import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function FullLayout({ children }) {
    return (
        <div className="h-screen">
            {children}
        </div>
    );
}

export default FullLayout;
