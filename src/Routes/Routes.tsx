import { Outlet, createBrowserRouter } from 'react-router-dom';
import { NavBar } from '../Components/NavBar/NavBar';
import { CoinsPage } from '../Components/Coins/CoinsPage';
import { AboutPage } from '../Components/About/AboutPage';
import { ReportsPage } from '../Components/Reports/ReportPage';
import { InputText } from '../Components/Input/inputText';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <>

            <NavBar />
            <Outlet/>

        </>,
        children: [
            {
                path: '/Coins',
                element: <>
                <CoinsPage/>
                </>
            },
            {
                path: '/Reports',
                element: <>
                <ReportsPage/>
                </>
            },
            {
                path: '/About',
                element: <>
                <AboutPage/>
                </>
            },
      
        ]
    },

]);



