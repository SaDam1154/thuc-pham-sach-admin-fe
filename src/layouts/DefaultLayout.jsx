import Header from './components/Header';
import Sidebar from './components/Sidebar';

function DefaultLayout({ heading, children }) {
    return (
        <div className="flex h-screen max-h-[screen] overflow-hidden">
            <Sidebar></Sidebar>

            <div className="flex h-screen flex-1 flex-col overflow-x-hidden">
                <Header>{heading}</Header>
                <main className="flex-1 overflow-y-auto py-5">{children}</main>
            </div>
        </div>
    );
}

export default DefaultLayout;
