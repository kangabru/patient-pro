import useUser from "@/api/user"
import { Children, clx } from "@/common/utils"
import NotificationBell from "@/components/NotificationBell"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react"
import {
  ArrowRightStartOnRectangleIcon,
  CogIcon,
  CreditCardIcon,
} from "@heroicons/react/16/solid"
import {
  Bars3CenterLeftIcon,
  ClockIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"
import { ReactNode, useMemo, useState } from "react"

const navigation = {
  "My Practice": { href: "#", icon: HomeIcon, current: false },
  Appointments: { href: "#", icon: ClockIcon, current: false },
  Patients: { href: "#", icon: UserGroupIcon, current: true },
  Documents: { href: "#", icon: DocumentChartBarIcon, current: false },
  Billing: { href: "#", icon: CreditCardIcon, current: false },
}
const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Logout", href: "#", icon: ArrowRightStartOnRectangleIcon },
]

type PageName = keyof typeof navigation

export default function Page(
  props: Children & { page: PageName; header?: ReactNode },
) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <div className="min-h-full">
        <Sidebar
          page={props.page}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <div className="flex flex-1 flex-col lg:pl-64">
          <HeaderBar
            header={props.header}
            openSidebar={() => setSidebarOpen(true)}
          />
          {props.children}
        </div>
      </div>
    </>
  )
}

function Sidebar(props: {
  open: boolean
  setOpen: (open: boolean) => void
  page: PageName
}) {
  const { open, setOpen, page } = props
  return (
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-10 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs flex-1 transform flex-col bg-indigo-700 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute right-0 top-0 -mr-12 pt-2 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            <SideBarContent page={page} />
          </DialogPanel>
        </div>
      </Dialog>

      <div className="fixed inset-y-0 hidden w-64 flex-col bg-indigo-600 lg:flex">
        <SideBarContent page={page} />
      </div>
    </>
  )
}

function SideBarContent(props: { page: PageName }) {
  const user = useUser()
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    return hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening"
  }, [])
  return (
    <>
      <div className="flex select-none items-center p-4 text-white">
        <img
          alt="PatientPro logo"
          src="/logo-white.png"
          className="mr-2 h-8 w-auto"
        />
        <p>PatientPro</p>
        <div className="flex-1" aria-hidden="true" />
        <NotificationBell />
      </div>
      <div className="my-4 px-4 text-white">
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              alt="Profile avatar"
              src={user.avatar}
              className="mr-2 h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <p>
                {greeting}, {user.first_name}
              </p>
              <p className="flex items-center text-xs">
                <HomeIcon className="mr-1 h-3 w-3" />
                {user.practice.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav
        aria-label="Sidebar"
        className="flex h-full flex-col overflow-y-auto p-2"
      >
        <div className="space-y-1">
          {Object.entries(navigation).map(([name, item]) => {
            const current = props.page === name
            return (
              <a
                key={name}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={clx(
                  current
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-50 hover:bg-white/5 hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-base font-medium",
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-200"
                />
                {name}
              </a>
            )
          })}
        </div>
        <div className="my-4 flex-1" />
        <div className="">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:bg-white/5 hover:text-white"
              >
                <item.icon
                  aria-hidden="true"
                  className="mr-4 h-6 w-6 text-indigo-200"
                />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

function HeaderBar(props: { header?: ReactNode; openSidebar: () => void }) {
  return (
    <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm lg:border-none">
      <button
        type="button"
        onClick={props.openSidebar}
        className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3CenterLeftIcon aria-hidden="true" className="h-6 w-6" />
      </button>
      {props.header ?? <div aria-hidden="true" className="flex-1" />}
    </div>
  )
}
