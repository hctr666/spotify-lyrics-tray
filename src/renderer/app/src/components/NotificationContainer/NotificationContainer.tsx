import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const NotificationContainer = () => {
  return (
    <ToastContainer
      position='top-right'
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      theme='colored'
      limit={2}
    />
  )
}
