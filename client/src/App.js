import './style.scss'

import {
  createBrowserRouter,
  RouterProvider,
 
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Single from "./pages/Single";
import Write from "./pages/Write";





const router = createBrowserRouter([
  {
    path: "/*",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/post/:id",
    element: <Single />,
  },
  {
    path: "/write",
    element: <Write />,
  },
]);

function App() {
  return (
    <div className="App">
      <div className="container">
        
        <RouterProvider router={router} />
        
      </div>
    </div>
  );
}

export default App;
