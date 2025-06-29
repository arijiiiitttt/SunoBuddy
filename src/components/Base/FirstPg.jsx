import React from 'react';


const FirstPg = () => {
 

  return (
    <div className="h-fit gap-d-10 w-full  pt-40 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
            🟠 Made for you Bro
          </span>
        </div>
        <p className='text-3xl Brico font-light'>Wanna Learn Something🏆</p>
        <h1 className="text-6xl tracking-tight text-blue-900 text-black bowl">Your voice friend, always </h1>
        <h1 className="text-6xl text-blue-900 tracking-tight bowl"> near always helping.</h1>
        <p className="text-lg ">"Bridging the visual gap: AI-powered image descriptions for a clearer world 🚀
"</p>

        <div className="flex space-x-4 justify-center">
          <a
            href="#"
            className="bg-white border-2 font-semibold border-blue-900 text-md text-blue-900 py-3 px-6 text-bold rounded-full hover:text-white hover:bg-blue-900 hover:border-blue-900"
          >
            Give ⭐ to my repo
          </a>
          <a
           href="/hi"
            className="bg-blue-900 border-3 font-semibold border-blue-900 text-md text-white py-3 px-7 rounded-full hover:border-black hover:text-white hover:bg-red-500"
          >
            Let's Learn 🚀
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirstPg;
