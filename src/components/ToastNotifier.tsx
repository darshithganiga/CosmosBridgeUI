import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Customstyles/ToastStyles.css";

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export const showToast = {
  info: (message: string) => toast.info(message, toastConfig),
  success: (message: string) => toast.success(message, toastConfig),
  error: (message: string) => toast.error(message, toastConfig),
};

const ToastNotifier = () => <ToastContainer toastClassName="custom-toast" />;
export default ToastNotifier;
