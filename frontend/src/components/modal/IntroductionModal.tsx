import * as React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiEdit3, FiSend, FiClock } from "react-icons/fi";
import Modal from "@mui/material/Modal";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

const IntroductionModal: React.FC<Props> = ({ isOpen, handleClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="how-it-works-title"
      aria-describedby="how-it-works-description"
    >
      <div className="px-4 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className="p-12 bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] shadow-[0_0_20px_rgba(58,110,165,0.8)] 
                    rounded-lg max-w-md w-full text-center flex flex-col gap-6"
        >
          {/* 🔥 Title with Icon */}
          <div className="flex items-center justify-center gap-2 text-[#4FC3F7] font-bold text-xl">
            <FaCheckCircle className="text-blue-400 text-2xl" />{" "}
            <span className="text-3xl">How It Works</span>
          </div>

          {/* 📝 Steps */}
          <div className="mt-4 space-y-6 text-[#B0BEC5] text-lg">
            {/* Step 1 */}
            <div className="flex gap-6 items-center">
              <div className="flex items-start justify-center text-white">
                <FiEdit3 size={24} />
              </div>
              <span className="text-left">
                Enter a <b>Memecoin</b> prompt in the textarea.
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-center">
              <div className="flex items-start justify-center text-white">
                <FiSend size={24} />
              </div>
              <span className="text-left">
                Click the <b>arrow button</b> in the bottom right to submit.
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center text-white">
                <FiClock size={24} />
              </div>
              <span className="text-left">
                Wait while the AI creates your unique <b>Memecoin</b>.
              </span>
            </div>
          </div>

          {/* 🔳 Close Button */}
          <button
            onClick={handleClose}
            className="bg-[rgba(58,110,165,0.8)] text-[#E3F2FD] px-5 py-2 rounded-lg 
                                hover:bg-[rgba(58,110,165,1)] hover:shadow-[0_0_10px_rgba(58,110,165,1)] 
                                transition-all duration-300 mt-2"
          >
            Got It!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IntroductionModal;
