import usePatients, { PatientSaveRequest, type Patient } from "@/api/patient"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { Formik, useField } from "formik"
import React, { useState } from "react"
import { Form } from "react-router-dom"

export type Mode = "display" | "edit"
export interface PatientFormProps {
  patient: Patient
  mode: Mode
  new?: boolean
  setMode: (mode: Mode) => void
  close: () => void
}

export default function PatientForm({
  patient,
  mode,
  setMode,
  close,
}: PatientFormProps) {
  const disabled = mode === "display"
  const cancelOrClose = () => {
    if (patient.prefix_id) setMode("display")
    else close()
  }
  return (
    <Formik<PatientSaveRequest>
      initialValues={patient}
      onSubmit={async (values, ops) => {
        const { update, create } = usePatients.getState()
        const apiCall = patient.prefix_id
          ? update(patient.prefix_id, values)
          : create(values)

        ops.setSubmitting(true)
        const [success, errors] = await apiCall
        ops.setSubmitting(false)

        if (success) {
          ops.setSubmitting(false)
          cancelOrClose()
        } else {
          ops.setErrors(errors)
        }
      }}
    >
      {({ isSubmitting, handleSubmit, resetForm }) => (
        <Form method="POST" onSubmit={handleSubmit}>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextInput
              label="First Name"
              name="first_name"
              placeholder="Jane"
              required
              disabled={disabled}
            />

            <TextInput
              label="Last Name"
              name="last_name"
              placeholder="Summers"
              required
              disabled={disabled}
            />

            <TextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="jane@gmail.com"
              disabled={disabled}
            />

            <TextInput
              label="Phone Number"
              name="phone_number"
              type="tel"
              placeholder="912 345 6789"
              disabled={disabled}
            />

            <TextInput
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              placeholder="12 Jan, 1986"
              required
              disabled={disabled}
            />

            <SelectInput
              label="Gender"
              name="gender"
              required
              disabled={disabled}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </SelectInput>
          </div>

          {mode === "edit" && (
            <div className="mt-6 flex flex-row-reverse items-center gap-x-6">
              <button
                type="submit"
                name="intent"
                value="save"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {patient.prefix_id ? (
                  <>{isSubmitting ? "Saving..." : "Save"}</>
                ) : (
                  <>{isSubmitting ? "Creating..." : "Create"}</>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  cancelOrClose()
                }}
                className="place-self-center rounded-md px-2 py-1 text-sm font-semibold text-black ring-indigo-300 focus:ring-1"
              >
                Cancel
              </button>
              <div className="flex-1" aria-hidden="true" />
              {patient.prefix_id && (
                <DeleteButton id={patient.prefix_id} onDelete={close} />
              )}
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

type HtmlProps<T> = React.DetailedHTMLProps<React.InputHTMLAttributes<T>, T>

function TextInput({
  label,
  className,
  ...props
}: Omit<HtmlProps<HTMLInputElement>, "name"> & {
  name: keyof Patient
  label: string
}) {
  const [field, meta] = useField(props as any)
  return (
    <div className={className}>
      <label
        htmlFor={props.id || props.name}
        className="block pl-1 text-sm font-medium leading-6 text-gray-900"
      >
        {props.required && !props.disabled && <span className="mr-1">*</span>}
        {label}
      </label>
      {props.disabled ? (
        <span className="block w-full rounded-md border-0 bg-gray-50 px-2 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
          {field.value || <>&nbsp;</>}
        </span>
      ) : (
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:bg-gray-50 sm:text-sm sm:leading-6"
          type="text"
          {...(field as any)}
          {...(props as any)}
        />
      )}
      {meta.touched && meta.error ? (
        <div className="pl-2 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  )
}

function SelectInput({
  label,
  className,
  ...props
}: Omit<HtmlProps<HTMLSelectElement>, "name"> & {
  name: keyof Patient
  label: string
}) {
  const [field, meta] = useField(props as any)
  return (
    <div className={className}>
      <label
        htmlFor={props.id || props.name}
        className="block pl-1 text-sm font-medium leading-6 text-gray-900"
      >
        {props.required && !props.disabled && <span className="mr-1">*</span>}
        {label}
      </label>
      {props.disabled ? (
        <span className="block w-full rounded-md border-0 bg-gray-50 px-2 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
          {field.value || <>&nbsp;</>}
        </span>
      ) : (
        <select
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:bg-gray-50 sm:text-sm sm:leading-6"
          {...(field as any)}
          {...(props as any)}
        />
      )}
      {meta.touched && meta.error ? (
        <div className="pl-2 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  )
}

function DeleteButton(props: { id: string; onDelete: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const _delete = async () => {
    setIsSubmitting(true)
    await usePatients.getState().delete(props.id)
    props.onDelete()
    setIsSubmitting(false)
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-red-200 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Delete
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Delete Patient
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this patient? This cannot
                      be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={_delete}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
