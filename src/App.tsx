import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/Routes';



export const App =() => {

  return <RouterProvider router={router} />

}

export default App;
