import React from 'react';


const FirstPg = () => {
 

  return (
    <div className="h-fit gap-d-10 w-full bg-gray-100/50 pt-40 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
            🟠 Made for you Bro
          </span>
        </div>
        <p className='text-3xl oldstylee   font-light  '>Wanna Discover your Taste😍</p>
        <h1 className="text-6xl text-blue-300 font-bold bowl">Whispers of place echoes</h1>
        <h1 className="text-6xl text-red-600 font-bold bowl"> of soul Lokaa guides.</h1>
        <p className="text-lg text-red-800">"Feel the place. Match the vibe. Live culture.
"</p>

        <div className="flex space-x-4 justify-center">
          <a
            href="#"
            className="bg-orange-600 text-md text-white py-3 px-6 rounded hover:text-orange-200"
          >
            Give ⭐ to my repo
          </a>
          <a
           href="/hi"
            className="bg-green-700 text-md text-white py-3 px-6 rounded hover:text-green-200"
          >
            Let's Learn 🚀
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirstPg;
