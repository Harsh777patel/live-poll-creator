"use client";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Poll = () => {
  const router = useRouter();
  const { id } = useParams();

  const [socket, setSocket] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsSocketReady(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketReady(false);
    });

    setSocket(newSocket);
    newSocket.connect();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const [roomData, setRoomData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [pollOptions, setPollOptions] = useState([]);
  const [response, setResponse] = useState("");
  const [appear, setAppear] = useState(true);

  const fetchRoomData = async () => {
    try {
      const res = await axios.get("/room/getbyid/" + id);
      setAppear(true);
      setRoomData(res.data);

      // Join room after socket is ready
      if (socket && isSocketReady) {
        const { title } = res.data;
        socket.emit("join-room", title);
        console.log("Joined room:", title);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id, isSocketReady]);

  const sendResponse = () => {
    if (socket && roomData) {
      if (!response.trim()) {
        toast.error("Please enter or select a response");
        return;
      }
      socket.emit("send-response", { roomName: roomData.title, response });
      toast.success("Response sent successfully!");
    }
  };

  useEffect(() => {
    if (!socket || !isSocketReady) return;

    const handleQuestion = (payload) => {
      console.log("Question received:", payload);
      if (typeof payload === "string") {
        setCurrentQuestion(payload);
        setQuestionType("text");
        setPollOptions([]);
      } else {
        setCurrentQuestion(payload.question);
        setQuestionType(payload.questionType);
        setPollOptions(payload.options || []);
      }
      setResponse("");
      setAppear(false);
    };

    socket.on("get-question", handleQuestion);

    return () => {
      socket.off("get-question", handleQuestion);
    };
  }, [socket, isSocketReady]);

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
              {questionType === "text"
                ? "Respond with one word to add your voice to the poll. Let your word shape the conversation!"
                : "Select an option to add your voice to the poll."}
            </p>

            {questionType === "text" ? (
              <>
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
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {pollOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-3 text-lg font-semibold rounded-lg border-2 transition-all ${response === opt
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-800 border-gray-300 hover:border-violet-400"
                      }`}
                    onClick={() => setResponse(opt)}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  className="w-full md:w-auto font-semibold text-white bg-violet-700 px-6 py-2 mt-4 rounded-lg shadow-xl text-base md:text-lg"
                  onClick={sendResponse}
                >
                  Submit Vote
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
