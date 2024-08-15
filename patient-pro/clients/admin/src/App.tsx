import { createBrowserRouter, RouterProvider } from "react-router-dom"
import usePatients from "./api/patient"
import Patient from "./pages/Patient"
import Patients from "./pages/Patients"

const router = createBrowserRouter([
  {
    path: "/",
    loader: async ({ request }) => {
      const url = new URL(request.url)
      const q = url.searchParams.get("q")!
      usePatients.getState().fetch(q)
      return null
    },
    element: <Patients />,
    children: [
      {
        path: "patients/new",
        element: <Patient new />,
      },
      {
        path: "patients/:patientId",
        loader: ({ params: { patientId } }) => {
          usePatients.getState().read(patientId!)
          return null
        },
        element: <Patient />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
