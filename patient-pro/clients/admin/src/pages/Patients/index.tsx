import usePatients from "@/api/patient"
import Page from "@/components/Page"
import { RandDemoInt, RandLastVisit, Years } from "@/components/SeededStats"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react"
import { Bars4Icon, ListBulletIcon } from "@heroicons/react/16/solid"
import {
  BarsArrowUpIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"
import { Form, Link, Outlet } from "react-router-dom"

export default function Patients() {
  const loading = usePatients((s) => s.loadingPatients)
  return (
    <>
      <Page
        page="Patients"
        header={
          <div className="flex w-full items-center justify-between px-4 sm:px-8">
            <SearchBar />
            <Link
              to="/patients/new"
              className="ml-2 place-self-center rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-inset ring-indigo-300 hover:bg-indigo-700 focus:ring-1 sm:text-sm"
            >
              Add Patient
            </Link>
          </div>
        }
      >
        <main className="my-8">
          <section>
            <div className="mx-auto flex max-w-6xl items-center space-x-2 px-4 sm:px-8">
              <div className="pl-1">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Patients
                </h2>
                <p className="text-sm">Organise your patients</p>
              </div>
              <div className="flex-1" />
              <Actions />
            </div>
            {loading ? <SkeletonUI /> : <PatientsData />}
          </section>
        </main>
      </Page>
      <Outlet />
      <ErrorAlerts />
    </>
  )
}

function SearchBar() {
  return (
    <div className="flex flex-1 justify-between lg:max-w-6xl">
      <div className="flex flex-1">
        <Form method="GET" action="/" className="flex w-full md:ml-0">
          <label htmlFor="q" className="sr-only">
            Search
          </label>
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center"
            >
              <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5" />
            </div>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Search patients"
              className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-0"
            />
          </div>
        </Form>
      </div>
    </div>
  )
}

function PatientsData() {
  const patients = usePatients((s) => s.patients)
  return (
    <div className="mx-auto mt-4 flex max-w-6xl flex-col sm:px-8">
      <div className="min-w-full overflow-hidden bg-white align-middle shadow sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Patient Name
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Last Visit
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                >
                  DOB
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                >
                  Age
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                >
                  Appointments
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                >
                  Documents
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                >
                  Calls & Emails
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {patients.map((patient) => (
                <tr key={patient.prefix_id} className="bg-white">
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                    <Link
                      to={`/patients/${patient.prefix_id}`}
                      className="group inline-flex space-x-2 truncate rounded-md px-1 py-0 text-sm text-indigo-800 hover:underline"
                    >
                      {patient.first_name} {patient.last_name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-left text-sm text-gray-500">
                    <RandLastVisit patient={patient} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-left text-sm text-gray-500">
                    {patient.gender}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                    <time dateTime={patient.date_of_birth}>
                      {patient.date_of_birth}
                    </time>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                    <Years date={patient.date_of_birth} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-left text-sm text-gray-500">
                    {patient.phone_number}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-left text-sm text-gray-500">
                    {patient.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                    {/* Appointments */}
                    <RandDemoInt patient={patient} offset={10} max={8} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                    {/* Documents */}
                    <RandDemoInt patient={patient} offset={20} max={8} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                    {/* Calls/emails */}
                    <RandDemoInt patient={patient} offset={30} max={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav
          aria-label="Pagination"
          className="flex w-full items-center justify-end border-t border-gray-200 bg-white px-4 py-3"
        >
          <div className="hidden justify-end sm:block">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{patients.length}</span> result
              {patients.length === 1 ? "" : "s"}
            </p>
          </div>
        </nav>
      </div>
    </div>
  )
}

const sortValueSelected = "Created"
const sortValues: string[] = [
  "Name",
  "Created",
  "Last Updated",
  "Gender",
  "Date of Birth",
  "Age",
  "Appointments",
  "Documents",
  "Calls & Emails",
]

const viewValues = [
  { name: "Grid", icon: Squares2X2Icon },
  { name: "List", icon: ListBulletIcon, selected: true },
  { name: "Compacy", icon: Bars4Icon },
]

function Actions() {
  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
          <BarsArrowUpIcon
            aria-hidden="true"
            className="-ml-0.5 h-5 w-5 translate-y-0.5 text-gray-400"
          />
          <span>Sort</span>
        </MenuButton>
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortValues.map((name) => (
              <MenuItem key={name}>
                <button className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                  <span>{name}</span>
                  {name === sortValueSelected && (
                    <BarsArrowUpIcon
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 text-gray-400"
                    />
                  )}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
      <Menu as="div" className="relative">
        <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
          <Bars4Icon
            aria-hidden="true"
            className="-ml-1 h-5 w-5 scale-95 text-gray-400"
          />
          <span>View</span>
        </MenuButton>
        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {viewValues.map((item) => (
              <MenuItem key={item.name}>
                <button className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                  <item.icon
                    aria-hidden="true"
                    className="-ml-1 mr-2 h-5 w-5 scale-95 text-gray-400"
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.selected && (
                    <div
                      aria-hidden="true"
                      className="ml-2 h-1.5 w-1.5 rounded-full bg-gray-400"
                    />
                  )}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </>
  )
}

function SkeletonUI() {
  return (
    <div className="mx-auto mt-4 flex max-w-6xl flex-col sm:mx-8">
      <div className="min-w-full overflow-hidden align-middle shadow sm:rounded-lg">
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="grid grid-cols-3 bg-gray-50 px-6 py-4">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-300" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
            </div>
            <div className="divide-y divide-gray-200">
              <div className="grid grid-cols-3 bg-white px-6 py-4">
                <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="grid grid-cols-3 bg-white px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="grid grid-cols-3 bg-white px-6 py-4">
                <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-white p-3 pl-4 sm:pl-6">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

function ErrorAlerts() {
  const error = usePatients((s) => s.error)
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {!!error && (
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
            <div className="p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-red-400"
                  />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Error</p>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => usePatients.setState({ error: undefined })}
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
