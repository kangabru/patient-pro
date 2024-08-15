import useNotifications, { type Notification } from "@/api/notification"
import { clx } from "@/common/utils"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react"
import { BellIcon } from "@heroicons/react/20/solid"
import { useState } from "react"

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  const [notifications, remove, clear] = useNotifications()
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="relative rounded-full p-1 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span>
        <BellIcon aria-hidden="true" className="h-6 w-6" />
        {notifications.length > 0 && (
          <div className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded bg-white p-0 text-black">
            <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-[0.55rem]">
              {notifications.length}
            </span>
          </div>
        )}
      </button>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-20 text-black focus:outline-none"
        onClose={close}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-white p-6 pt-4 shadow-xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <div className="flex items-center justify-between">
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-medium text-black"
                >
                  Notifications
                </DialogTitle>
                {notifications.length > 0 && (
                  <button
                    className="place-self-center rounded-md px-2 py-1 text-xs font-semibold text-black ring-indigo-300 focus:ring-1"
                    onClick={clear}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-4">
                {notifications.length ? (
                  notifications.map((n) => (
                    <Notification
                      key={n.id}
                      notification={n}
                      remove={() => remove(n)}
                    />
                  ))
                ) : (
                  <p>You've cleared all of your notifications</p>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

function Notification(props: {
  notification: Notification
  remove: () => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <Transition
      show={open}
      afterLeave={props.remove}
      as="div"
      className={clx(
        "flex w-full divide-x divide-gray-200 rounded-lg opacity-100 ring-1 ring-black/10",
        "data-[leave]:data-[closed]:opacity-0 data-[leave]:duration-300",
      )}
    >
      <div className="flex w-0 flex-1 items-center p-4">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">
            {props.notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {props.notification.details}
          </p>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col divide-y divide-gray-200">
          <div className="flex h-0 flex-1">
            <button
              disabled
              type="button"
              className="flex w-full cursor-not-allowed items-center justify-center rounded-none rounded-tr-lg border border-transparent px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              View
            </button>
          </div>
          <div className="flex h-0 flex-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-none rounded-br-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Hide
            </button>
          </div>
        </div>
      </div>
    </Transition>
  )
}
