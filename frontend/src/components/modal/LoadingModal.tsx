import { PacmanLoader } from "react-spinners";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

const LoadingModal: React.FC<Props> = ({ isOpen, handleClose }) => {
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsTakingTooLong(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div className="px-4 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className="bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] shadow-[0_0_20px_rgba(58,110,165,0.8)] 
                    rounded-lg p-12 max-w-md w-full text-center flex flex-col"
        >
          {/* 🔥 Loading 圖示 */}
          <div className="flex justify-center mb-4">
            <PacmanLoader color="#4FC3F7" size={30} />
          </div>

          {/* 🔵 提示標題 */}
          <h2 className="text-[#4FC3F7] font-bold text-xl">
            Processing Your Request...
          </h2>

          {/* 📝 提示內容 */}
          <p className="mt-6 text-[#B0BEC5] text-lg">
            Please do not close or refresh the page to avoid unnecessary errors.
          </p>

          {/* ⚠️ 超過 30 秒時顯示 */}
          {isTakingTooLong && (
            <p className="mt-6 text-yellow-400 font-medium">
              {`⚠️ It's taking longer than expected. Please refresh
							and try again.`}
            </p>
          )}

          {/* 🔳 Close Button */}
          {isTakingTooLong && (
            <button
              onClick={handleClose}
              className="mt-6 bg-[rgba(58,110,165,0.8)] text-[#E3F2FD] px-5 py-2 rounded-lg 
                                    hover:bg-[rgba(58,110,165,1)] hover:shadow-[0_0_10px_rgba(58,110,165,1)] 
                                    transition-all duration-300"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;
