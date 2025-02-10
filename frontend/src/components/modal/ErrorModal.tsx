import * as React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Modal from "@mui/material/Modal";

interface Props {
  isOpen: boolean;
  title: string;
  errorMessage: string;
  handleClose: () => void;
}

const ErrorModal: React.FC<Props> = ({
  isOpen,
  title,
  errorMessage,
  handleClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="px-4 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className="p-12 bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] shadow-[0_0_20px_rgba(58,110,165,0.8)] 
                    rounded-lg max-w-md w-full text-center flex flex-col gap-6"
        >
          {/* 🔥 Title with Icon */}
          <div className="flex items-center justify-center gap-2 text-[#4FC3F7] font-bold text-xl">
            <FaExclamationTriangle className="text-yellow-400 text-2xl" />{" "}
            <span className="text-3xl">{title}</span>
          </div>

          {/* 📝 Error Message */}
          <p className="mt-4 text-[#B0BEC5] text-lg">{errorMessage}</p>

          {/* 🔳 Close Button */}
          <button
            onClick={handleClose}
            className="bg-[rgba(58,110,165,0.8)] text-[#E3F2FD] px-5 py-2 rounded-lg 
                                hover:bg-[rgba(58,110,165,1)] hover:shadow-[0_0_10px_rgba(58,110,165,1)] 
                                transition-all duration-300 mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
