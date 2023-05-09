import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import App from "./App";
import DetailsMedicine from "./pages/MedicineDetails/DetailsMedicine"
import ManageMedicines from "./pages/manage-medicines/ManageMedicines";
import AddMedicine from "./pages/manage-medicines/AddMedicine";
import UpdateMedicine from "./pages/manage-medicines/UpdateMedicine";
import AddCategory from "./pages/manage-categories/AddCategory";
import UpdateCategory from "./pages/manage-categories/UpdateCategory";
import ManageCategories from "./pages/manage-categories/ManageCategories";
import ManagePatients from "./pages/manage-patients/ManagePatients";
import AddPatients from "./pages/manage-patients/AddPatients";
import UpdatePatients from "./pages/manage-patients/UpdatePatients";
import Requests from "./pages/ShowRequests/Requests";
import Category from "./pages/home/Category";
import MyRequests from "./pages/ShowMyRequests/MyRequests";
import Guest from "./middleware/Guest";
import Admin from "./middleware/Admin";
import ListSearch from "./pages/home/ListSearch";
export const routes = createBrowserRouter([
    {
        path: '',
        element: <App />,
        children: [
            {
                path: "/home/:id",
                element: <Home />,
            },
            {
                path: "/ListSearch",
                element: <ListSearch />,
            },
            {
                path: "/Category",
                element: <Category />,
            },
            {
                path: "/MyRequests",
                element: <MyRequests />,
            },
            {
                path: "/details/:id",
                element: <DetailsMedicine />,
            },
            {
                 element:<Guest/>,
                 children:[
                    {
                        path: "/login",
                        element: <Login />,
                    },
                    {
                        path: "/register",
                        element: <Register />,
                    },
                 ]
            },
            {
                path: "/manage-medicines",
                element:<Admin/>,
                children: [
                    {
                        path: '',
                        element: <ManageMedicines/>
                    },
                    {
                        path: "add",
                        element: <AddMedicine/>
                    },
                    {
                        path: ":id",
                        element: <UpdateMedicine/>
                    },
                ]
            },
            {
                path: "/manage-categories",
                element:<Admin/>,
                children: [
                    {
                        path: '',
                        element: <ManageCategories/>
                    },
                    {
                        path: "add",
                        element: <AddCategory/>
                    },
                    {
                        path: ":id",
                        element: <UpdateCategory/>
                    },
                ]
            },
            {
                path: "/ShowMyRequests",
                element:<Guest/>,
                children: [
                    {
                        path: '',
                        element: <MyRequests/>
                    },
                ]
            },
            {
                path: "/manage-patients",
                element:<Admin/>,
                children: [
                    {
                        path: '',
                        element: <ManagePatients/>
                    },
                    {
                        path: "add",
                        element: <AddPatients/>
                    },
                    {
                        path: ":id",
                        element: <UpdatePatients/>
                    },
                ]
            },
            {
                path: "/ShowRequests",
                element:<Requests/>
            },
        ]
    },
    {
        path: '*',
        element: <Navigate to={"/"} />
    }
]);