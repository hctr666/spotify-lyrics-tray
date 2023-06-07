import { toast } from 'react-toastify'

export const useToastError = () => {
  return (id: string, error: string) => {
    toast.error(error, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: 0,
      theme: 'colored',
      toastId: id,
    })
  }
}
