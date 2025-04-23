import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Customstyles/ToastStyles.css";
import { useEffect } from "react";

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
type ToastNotifierProps = {
  onShow?: () => void;
  onHide?: () => void;
};

const ToastNotifier = ({ onShow, onHide }: ToastNotifierProps) => {
  useEffect(() => {
    toast.onChange((payload) => {
      if (payload.status === "added") {
        onShow?.();
      }
      if (payload.status === "removed") {
        onHide?.();
      }
    });
  }, [onShow, onHide]);

  return <ToastContainer toastClassName="custom-toast" />;
};
export default ToastNotifier;
