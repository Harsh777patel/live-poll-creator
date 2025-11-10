"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Poll = () => {
  const router = useRouter();
  const { id } = useParams();

  const [socket, setSocket] = useState(
    io("https://live-poll-backend-akq0.onrender.com", { autoConnect: false })
  );

  const [roomData, setRoomData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [appear, setAppear] = useState(true);

  const fetchRoomData = async () => {
    socket.connect();
    const res = await axios.get("https://live-poll-backend-akq0.onrender.com/room/getbyid/" + id);
    setAppear(true);
    setRoomData(res.data);
    const { title } = res.data;
    socket.emit("join-room", title);
  };

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  const sendResponse = () => {
    socket.emit("send-response", { roomName: roomData.title, response });
    toast.success("Response sent successfully!");
  };

  socket.on("get-question", (question) => {
    setCurrentQuestion(question);
    setAppear(false);
  });

  if (roomData === null) {
    return <h1 className="text-center mt-10 text-2xl">Loading poll details...</h1>;
  }

  return (
    <div className="relative min-h-screen bg-violet-300 text-center p-6">
      <h1 className="text-3xl md:text-5xl mt-4 font-bold text-gray-900 dark:text-neutral-400">
        Live Poll: Share Your Voice
      </h1>

      <div className="mt-6 mx-auto w-full max-w-5xl px-4">
        
        <div className=" bg-white px-4 py-3 rounded-lg text-left text-xl md:text-2xl font-semibold mb-6">
          <span className="mr-2">Question:</span>
          {appear ? (
            <span className="text-black">
              Waiting for the Host to Set the Question...
            </span>
          ) : (
            <span className="text-black">{currentQuestion}</span>
          )}
        </div>

        
        <div className="flex flex-col mt-4 md:flex-row items-center justify-center gap-8">
          
          <img
            src="/response.png"
            alt="Poll Illustration"
            className="w-full md:w-1/2 max-w-sm rounded-lg shadow-lg"
          />

          <div className="w-full md:w-1/2">
            <label className="block text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Respond Now
            </label>
            <p className="text-base md:text-lg font-medium mb-3 text-gray-900">
              Respond with one word to add your voice to the poll. Let your word shape the conversation!
            </p>
            <textarea
              className="w-full h-32 md:h-28 bg-gray-50 px-4 py-3 rounded-lg text-black text-lg md:text-2xl resize-none"
              placeholder="Type here..."
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            ></textarea>
            <button
              className="w-full md:w-auto font-semibold text-violet-700 bg-white px-6 py-2 mt-4 rounded-lg shadow-xl text-base md:text-lg"
              onClick={sendResponse}
            >
              Send Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
