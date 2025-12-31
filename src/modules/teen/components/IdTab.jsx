import React from 'react';

const IdTab = ({ personalCode, qrCode }) => {
  return (
    <div className="flex-1 flex flex-col  space-y-4 ">
      {/* Digital Boarding Pass */}
      <div className="bg-white/50 w-full backdrop-blur-md border border-gray-300 shadow-lg rounded-lg p-2">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase">YOUR PERSONAL CODE</h1>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center mb-4">
          <div
            className="p-4"
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-sm font-bold">Personal Code: {personalCode}</p>
        </div>

        {/* Instructional Text */}
        <div className="text-center mb-6">
          <p className="text-base">Show your personal code at church entrance</p>
        </div>


        {/* Footer Section */}
        <div className="text-center">
          <a href="#" className="underline text-sm">Need Help?</a>
          <p className="text-xs mt-2 text-gray-600">
            This QR code contains your unique personal code for attendance. Keep it safe and show it at check-in. Use the recovery feature if you need a new code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdTab;