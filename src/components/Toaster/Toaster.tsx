import { toast, ToastOptions } from 'react-toastify'

class Toaster {
  private static config: ToastOptions = {
    position: 'top-right',
    className: 'copy-toast-message',
    autoClose: 2000,
    closeOnClick: true,
  }

  static info(message: string): void {
    toast.info(message, Toaster.config)
  }

  static success(message: string): void {
    toast.success(message, Toaster.config)
  }

  static warning(message: string): void {
    toast.warning(message, Toaster.config)
  }

  static error(message: string): void {
    toast.error(message, Toaster.config)
  }
}

export default Toaster
