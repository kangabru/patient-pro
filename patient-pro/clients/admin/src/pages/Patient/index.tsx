import usePatients, { type Patient } from "@/api/patient"
import { RandDemoInt } from "@/components/SeededStats"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import {
  DocumentTextIcon,
  ExclamationCircleIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid"
import { UsersIcon } from "@heroicons/react/24/solid"
import { useCallback, useState } from "react"
import { useNavigate, useNavigationType, useParams } from "react-router-dom"
import PatientForm, { Mode, PatientFormProps } from "./form"

export default function Patient(props: { new?: boolean }) {
  const navigateBack = useNavigateBack()

  const [mode, setMode] = useState<Mode>(props.new ? "edit" : "display")
  const loading = usePatients((s) => s.loadingPatient)

  const { patientId } = useParams()
  const patient = usePatients(
    useCallback((s) => s.findPatient(patientId), [patientId]),
  )

  return (
    <Dialog
      open
      as="div"
      className="relative z-10 text-black transition duration-300 ease-out focus:outline-none data-[closed]:opacity-0"
      onClose={navigateBack}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="data-[closed]:transform-[scale(95%)] w-full max-w-screen-md rounded-xl bg-white p-6 pt-4 shadow-xl duration-300 ease-out"
          >
            {props.new ? (
              <PatientInternal
                patient={{} as any}
                mode="edit"
                setMode={setMode}
                close={navigateBack}
              />
            ) : loading ? (
              <SkeletonUI />
            ) : patient ? (
              <PatientInternal
                patient={patient}
                mode={props.new ? "edit" : mode}
                setMode={setMode}
                close={navigateBack}
              />
            ) : (
              <NotFound />
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

function useNavigateBack() {
  const navType = useNavigationType() // = 'POP' on direct url visit otherwise 'PUSH'
  const navigate = useNavigate()
  return () => (navType === "POP" ? navigate("/") : navigate(-1))
}

function PatientInternal(props: PatientFormProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <DialogTitle
          as="h2"
          className="text-base font-semibold leading-7 text-gray-900"
        >
          {props.patient.prefix_id ? (
            <>Patient Information</>
          ) : (
            <>Add Patient Information</>
          )}
        </DialogTitle>
        {props.mode === "display" && (
          <button
            type="button"
            className="place-self-center rounded-md px-2 py-1 text-sm font-semibold text-black ring-indigo-300 focus:ring-1"
            onClick={() => props.setMode("edit")}
          >
            Edit
          </button>
        )}
      </div>
      <PatientForm {...props} />
      {props.mode === "display" && <QuickActions patient={props.patient} />}
    </>
  )
}

function SkeletonUI() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-300" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 h-4 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div>
          <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div>
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div>
          <div className="mb-2 h-4 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div>
          <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div>
          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center space-y-3 py-12 text-center">
      <ExclamationCircleIcon
        aria-hidden="true"
        className="h-10 w-10 text-red-200"
      />
      <h3 className="text-base font-medium text-black">Patient Not Found</h3>
    </div>
  )
}

function QuickActions({ patient }: { patient: Patient }) {
  const stats = [
    {
      id: 1,
      name: "Appointments",
      stat: <RandDemoInt patient={patient} offset={10} max={8} />,
      icon: UsersIcon,
      action: "Schedule",
    },
    {
      id: 2,
      name: "Documents",
      stat: <RandDemoInt patient={patient} offset={20} max={8} />,
      icon: DocumentTextIcon,
      action: "Upload",
    },
    {
      id: 3,
      name: "Calls & Emails",
      stat: <RandDemoInt patient={patient} offset={30} max={20} />,
      icon: PhoneIcon,
      action: "Contact",
    },
  ]
  return (
    <div className="mt-6">
      <h3 className="text-base leading-7 text-gray-900">Quick Actions</h3>

      <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white p-4 pb-7 ring-1 ring-gray-200"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
              <div className="absolute inset-x-0 bottom-0 flex w-full justify-between bg-gray-50 px-4 py-3 text-sm">
                <button
                  disabled
                  className="text-text-600 hover:text-text-500 cursor-not-allowed"
                >
                  View all<span className="sr-only"> {item.name}</span>
                </button>
                <button
                  disabled
                  className="cursor-not-allowed text-indigo-600 hover:text-indigo-500"
                >
                  {item.action}
                  <span className="sr-only"> {item.name}</span>
                </button>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
