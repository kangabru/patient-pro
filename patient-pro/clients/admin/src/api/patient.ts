import { sleep } from "@/common/utils"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface Patient {
  prefix_id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  gender?: "Male" | "Female" | "Other"
  phone_number?: string
  email?: string
  created_at: string
  updated_at: string
}

export type PatientSaveRequest = Pick<
  Patient,
  | "first_name"
  | "last_name"
  | "date_of_birth"
  | "gender"
  | "email"
  | "phone_number"
>

const ROUTE = "/api/patients"

type ApiSaveResponse = [true] | [false, Record<string, string>]

interface PatientApi {
  patients: Patient[]
  error?: string
  lastFetchQuery: string | undefined
  loadingPatient: boolean
  loadingPatients: boolean
  fetch: (query?: string) => Promise<void>
  read: (patientId: string) => Promise<void>
  create: (data: PatientSaveRequest) => Promise<ApiSaveResponse>
  update: (
    patientId: string,
    data: PatientSaveRequest,
  ) => Promise<ApiSaveResponse>
  delete: (patientId: string) => Promise<void>
  findPatient: (patientId: string | undefined) => Patient | null
  _findIndex: (patientId: string | undefined) => number
  _addPatient: (patient: Patient) => void
}

const usePatients = create<PatientApi>()(
  immer((set, get) => ({
    // State
    patients: [],
    lastFetchQuery: undefined,
    loadingPatient: true,
    loadingPatients: true,

    // CRUD
    fetch: async (_query) => {
      const query = _query || ""
      const state = get()
      const lastQuery = state.lastFetchQuery
      if (query === lastQuery) {
        set({ loadingPatients: false })
        return
      }

      set({ loadingPatients: true })
      const res = await fetch(query ? `${ROUTE}?q=${query}` : ROUTE)
      if (res.status < 300) {
        const patients: Patient[] = await res.json().then(delayForDemo)
        set({ patients, loadingPatients: false, lastFetchQuery: query })
      } else {
        set({ loadingPatients: false, error: "Failed to fetch patients" })
      }
    },
    read: async (patientId: string) => {
      const state = get()
      const existingPatient = state.findPatient(patientId)
      if (existingPatient) {
        set({ loadingPatient: false })
        return
      }

      set({ loadingPatient: true })
      const res = await fetch(`${ROUTE}/${patientId}`)
      if (res.status < 300) {
        const patient = await res.json().then(delayForDemo)
        get()._addPatient(patient)
      } else {
        set({ loadingPatient: false, error: "Failed to fetch patient" })
      }
    },
    create: async (data) => {
      const res = await fetch(ROUTE, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.status < 300) {
        const patient = await res.json().then(delayForDemo)
        get()._addPatient(patient)
        return [true]
      } else if (res.status < 500) {
        return [false, await res.json()]
      } else {
        set({ error: "Failed to create patient" })
        return [false, {}]
      }
    },
    update: async (patientId, data) => {
      const res = await fetch(`${ROUTE}/${patientId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.status < 300) {
        const patient = await res.json().then(delayForDemo)
        get()._addPatient(patient)
        return [true]
      } else if (res.status < 500) {
        return [false, await res.json()]
      } else {
        set({ error: "Failed to update patient" })
        return [false, {}]
      }
    },
    delete: async (patientId) => {
      const res = await fetch(`${ROUTE}/${patientId}`, {
        method: "DELETE",
      }).then(delayForDemo)
      if (res.status < 300) {
        set((s) => {
          s.patients = s.patients.filter((p) => p.prefix_id !== patientId)
        })
      } else {
        set({ error: "Failed to delete patient" })
      }
    },

    // Utils
    _findIndex: (id) => {
      return get().patients.findIndex((p) => p.prefix_id === id)
    },
    findPatient: (id) => {
      const state = get()
      const i = state._findIndex(id)
      return i === -1 ? null : state.patients[i]
    },
    _addPatient: (patient) => {
      set((s) => {
        const i = s._findIndex(patient.prefix_id)
        if (i === -1) s.patients.unshift(patient)
        else s.patients[i] = patient
        s.loadingPatient = false
      })
    },
  })),
)

async function delayForDemo<T>(args: T): Promise<T> {
  await sleep(200 + Math.random() * 800)
  return args
}

export default usePatients
