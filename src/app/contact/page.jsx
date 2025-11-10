"use client"
import React, { useState } from "react";

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "ff435a03-ef7f-4853-9e29-ab8e796674f6");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div>
      <>
        <div className="max-w-100% px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-violet-300">
          <div className="max-w-2xl lg:max-w-3xl  mx-auto bg-white px-4 py-2 rounded-xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black sm:text-4xl dark:text-white">
                Contact us
              </h1>
              <p className="mt-1 text-gray-600 dark:text-neutral-400">
                Contact us for support, feedback, or collaboration
                opportunities.
              </p>
            </div>

            <div className="flex flex-col m-4 border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
              <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Fill in the form
              </h2>
              <form onSubmit={onSubmit} >
                <div className="grid gap-4">
                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="hs-firstname-contacts-1"
                        className="sr-only"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="py-3 px-4 block w-full  bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="hs-lastname-contacts-1"
                        className="sr-only"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        
                        className="py-3 px-4 block w-full  bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>
                  {/* End Grid */}
                  <div>
                    <label htmlFor="hs-email-contacts-1" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                  
                      autoComplete="email"
                      className="py-3 px-4 block w-full  bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hs-phone-number-1" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="number"
                      maxlength="10"
                      className="py-3 px-4 block w-full  bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="hs-about-contacts-1" className="sr-only">
                      Ask your doubts
                    </label>
                    <textarea
                    
                      name="message"
                      type="text"
                      rows={6}
                      className="py-3 px-4 block w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Type your message here..."
                      defaultValue={""}
                      required
                    />
                  </div>
                </div>
                {/* End Grid */}
                <div className="mt-4 grid">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-800 text-white hover:bg-violet-700 focus:outline-none focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Send inquiry
                  </button>
                  <p className="mt-4">{result}</p>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    We will get back to you in some hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Contact;
