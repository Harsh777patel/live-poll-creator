"use client";
import { IconCopy } from "@tabler/icons-react";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactWordcloud from "react-wordcloud";
import { io } from "socket.io-client";

const words = [
  {
    text: "told",
    value: 64,
  },
  {
    text: "mistake",
    value: 11,
  },
  {
    text: "thought",
    value: 16,
  },
  {
    text: "bad",
    value: 17,
  },
  {
    text: "correct",
    value: 10,
  },
  {
    text: "day",
    value: 54,
  },
  {
    text: "prescription",
    value: 12,
  },
  {
    text: "time",
    value: 77,
  },
  {
    text: "thing",
    value: 45,
  },
  {
    text: "left",
    value: 19,
  },
  {
    text: "pay",
    value: 13,
  },
  {
    text: "people",
    value: 32,
  },
  {
    text: "month",
    value: 22,
  },
  {
    text: "again",
    value: 35,
  },
  {
    text: "review",
    value: 24,
  },
  {
    text: "call",
    value: 38,
  },
  {
    text: "doctor",
    value: 70,
  },
  {
    text: "asked",
    value: 26,
  },
  {
    text: "finally",
    value: 14,
  },
  {
    text: "insurance",
    value: 29,
  },
  {
    text: "week",
    value: 41,
  },
  {
    text: "called",
    value: 49,
  },
  {
    text: "problem",
    value: 20,
  },
  {
    text: "going",
    value: 59,
  },
  {
    text: "help",
    value: 49,
  },
  {
    text: "felt",
    value: 45,
  },
  {
    text: "discomfort",
    value: 11,
  },
  {
    text: "lower",
    value: 22,
  },
  {
    text: "severe",
    value: 12,
  },
  {
    text: "free",
    value: 38,
  },
  {
    text: "better",
    value: 54,
  },
  {
    text: "muscle",
    value: 14,
  },
  {
    text: "neck",
    value: 41,
  },
  {
    text: "root",
    value: 24,
  },
  {
    text: "adjustment",
    value: 16,
  },
  {
    text: "therapy",
    value: 29,
  },
  {
    text: "injury",
    value: 20,
  },
  {
    text: "excruciating",
    value: 10,
  },
  {
    text: "chronic",
    value: 13,
  },
  {
    text: "chiropractor",
    value: 35,
  },
  {
    text: "treatment",
    value: 59,
  },
  {
    text: "tooth",
    value: 32,
  },
  {
    text: "chiropractic",
    value: 17,
  },
  {
    text: "dr",
    value: 77,
  },
  {
    text: "relief",
    value: 19,
  },
  {
    text: "shoulder",
    value: 26,
  },
  {
    text: "nurse",
    value: 17,
  },
  {
    text: "room",
    value: 22,
  },
  {
    text: "hour",
    value: 35,
  },
  {
    text: "wait",
    value: 38,
  },
  {
    text: "hospital",
    value: 11,
  },
  {
    text: "eye",
    value: 13,
  },
  {
    text: "test",
    value: 10,
  },
  {
    text: "appointment",
    value: 49,
  },
  {
    text: "medical",
    value: 19,
  },
  {
    text: "question",
    value: 20,
  },
  {
    text: "office",
    value: 64,
  },
  {
    text: "care",
    value: 54,
  },
  {
    text: "minute",
    value: 29,
  },
  {
    text: "waiting",
    value: 16,
  },
  {
    text: "patient",
    value: 59,
  },
  {
    text: "health",
    value: 49,
  },
  {
    text: "alternative",
    value: 24,
  },
  {
    text: "holistic",
    value: 19,
  },
  {
    text: "traditional",
    value: 20,
  },
];

const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [30, 60],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
};

const Host = () => {
  const { id } = useParams();
  const [answerList, setAnswerList] = useState([]);
  const [wordsList, setWordsList] = useState([]);
  const [waiting, setWaiting] = useState(true);

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
      console.log("Host Socket connected:", newSocket.id);
      setIsSocketReady(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Host Socket disconnected");
      setIsSocketReady(false);
    });

    setSocket(newSocket);
    newSocket.connect();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const [roomData, setRoomData] = useState(null);
  const [question, setQuestion] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [activeQuestionType, setActiveQuestionType] = useState("text");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const copyLink = () => {
    const linkToCopy = typeof window !== "undefined"
      ? `${window.location.origin}/poll/${id}`
      : `https://live-poll-creator.vercel.app/poll/${id}`;

    navigator.clipboard
      .writeText(linkToCopy)
      .then((result) => {
        toast.success("Link copied");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occured");
      });
  };

  const fetchRoomData = async () => {
    try {
      const res = await axios.get("/room/getbyid/" + id);
      console.log("Room data fetched:", res.data);
      setRoomData(res.data);

      // Join room after socket is ready
      if (socket && isSocketReady) {
        const { title } = res.data;
        socket.emit("join-room", title);
        console.log("Host joined room:", title);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id, isSocketReady]);

  const askQuestion = () => {
    if (socket && isSocketReady && roomData && question.trim()) {
      if (questionType === "poll" && pollOptions.some((opt) => opt.trim() === "")) {
        toast.error("Please fill all poll options.");
        return;
      }

      const payload = {
        roomName: roomData.title,
        question,
        questionType,
        options: questionType === "poll" ? pollOptions : [],
      };

      socket.emit("set-question", payload);
      console.log("Question emitted:", payload);
      toast.success("Question Sent to the Poll");

      setAnswerList([]);
      setActiveQuestionType(questionType);
      setWaiting(true);

      setQuestion(""); // Clear question input
      if (questionType === "poll") {
        setPollOptions(["", ""]);
      }
    } else {
      toast.error("Not ready to send question");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleResponse = (response) => {
      setCurrentResponse(response);
      setAnswerList((prev) => [...prev, response]);
    };

    socket.on("get-response", handleResponse);

    return () => {
      socket.off("get-response", handleResponse);
    };
  }, [socket]);

  useEffect(() => {
    const wordCount = {};
    let isWaiting = answerList.length === 0;

    if (activeQuestionType === "poll") {
      isWaiting = false; // Show poll bars immediately even with 0 votes
      pollOptions.forEach(opt => {
        if (opt.trim()) wordCount[opt] = 0;
      });
    }

    answerList.forEach((answer) => {
      if (wordCount[answer] !== undefined) {
        wordCount[answer] += 1;
      } else {
        wordCount[answer] = 1;
      }
      isWaiting = false;
    });

    setWaiting(isWaiting);

    const temp = Object.keys(wordCount).map((key) => {
      return { text: key, value: wordCount[key] };
    });

    setWordsList(temp);
  }, [answerList, activeQuestionType, pollOptions]);

  if (roomData === null) {
    return <h1>Loading room details...</h1>;
  }

  return (
    <div className="relative min-h-screen bg-violet-300 text-center p-4">
      <h1 className="text-3xl md:text-5xl text-black font-bold">
        Create a Poll!
      </h1>

      <div className="bg-white flex flex-col lg:flex-row rounded-lg mt-6 gap-6">
        <div className="w-full lg:w-1/2">
          <div className="bg-violet-200 m-4 md:m-6 rounded-lg text-gray-900 px-4 py-3 font-semibold">
            <h1 className="text-xl md:text-2xl">Room Name: {roomData.title}</h1>
            <h1 className="text-xl md:text-2xl mt-4">
              Created By: {roomData.name}
            </h1>
          </div>

          <p className="text-md md:text-lg text-black p-2">
            Share the link to your Audience
          </p>

          <button
            className="flex gap-3 text-white bg-black px-4 py-3 rounded-lg shadow-xl mx-auto"
            onClick={copyLink}
          >
            <IconCopy />
            Copy Link
          </button>

          <label className="text-violet-800 px-2 py-4 font-bold text-xl md:text-2xl block">
            What would you like to ask your audience?
          </label>

          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md font-bold ${questionType === "text" ? "bg-violet-700 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setQuestionType("text")}
            >
              Text Question
            </button>
            <button
              className={`px-4 py-2 rounded-md font-bold ${questionType === "poll" ? "bg-violet-700 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setQuestionType("poll")}
            >
              Poll Options
            </button>
          </div>

          <input
            type="text"
            placeholder="Type your question here..."
            className="px-4 py-3 bg-gray-100 rounded-md border-2 shadow-xl w-full max-w-2xl mx-auto text-black block mb-4"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {questionType === "poll" && (
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-2 mb-4">
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    className="px-4 py-2 bg-gray-100 rounded-md border text-black w-full"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...pollOptions];
                      newOpts[idx] = e.target.value;
                      setPollOptions(newOpts);
                    }}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md font-bold"
                      onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button
                className="bg-violet-500 text-white px-3 py-2 mt-2 rounded-md w-fit font-semibold"
                onClick={() => setPollOptions([...pollOptions, ""])}
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            className="px-8 py-3 mt-4 mb-4 text-white text-md bg-violet-700 rounded-md font-bold mx-auto block"
            onClick={askQuestion}
          >
            Send Question
          </button>
        </div>

        <div className="w-full lg:w-1/2 bg-violet-200 text-violet-800 p-4 rounded-lg">
          {waiting ? (
            <div>
              <p className="font-semibold text-lg md:text-2xl p-2">
                Waiting for the response from the Audience...
              </p>
              <img
                src="/ques.png"
                alt="waiting"
                className="rounded-full mx-auto bg-black"
                width={250}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <h1 className="px-2 py-2 bg-white text-violet-800 rounded-lg w-2/3 sm:w-1/3 mx-auto font-semibold mb-2">
                Audience Response
              </h1>
              <div className="bg-white p-2 rounded-lg flex-1 min-h-[350px] overflow-auto flex flex-col justify-center items-center">
                {activeQuestionType === "text" ? (
                  <ReactWordcloud options={options} words={wordsList} />
                ) : (
                  <div className="w-full px-8 py-4 space-y-4">
                    {wordsList.map((item, idx) => {
                      const total = answerList.length;
                      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                      return (
                        <div key={idx} className="w-full text-left">
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-gray-700">{item.text}</span>
                            <span className="font-semibold text-violet-700">{percentage}% ({item.value} votes)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-violet-600 h-4 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Features */}
        <div className=" px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="max-w-7xl mx-auto rounded-lg shadow-md">
            <video
              className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg"
              src="/Video.mp4"
              muted
              loop
              autoPlay
              controls
            />
          </div>
          {/* Grid */}
          <div className="mt-4 p-6 rounded-lg lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12 bg-white text-black">
            <div className="lg:col-span-1">
              <h2 className="font-bold text-2xl mt-8 md:text-3xl text-gray-800 dark:text-neutral-200">
                From Setup to Word Cloud: Polling Made Easy
              </h2>
              <p className="mt-6 md:mt-4 text-gray-500 text-center dark:text-neutral-500">
                Getting started with your live poll is simple! Follow these easy
                steps to engage your audience and watch the results come to
                life. Running a live poll on our platform is simple,
                interactive, and effective. Follow these steps to create an
                engaging experience for your audience.
              </p>
            </div>
            {/* End Col */}
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
                {/* Icon Block */}
                <div className="flex gap-x-5">
                  <svg
                    className="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width={18} height={10} x={3} y={11} rx={2} />
                    <circle cx={12} cy={5} r={2} />
                    <path d="M12 7v4" />
                    <line x1={8} x2={8} y1={16} y2={16} />
                    <line x1={16} x2={16} y1={16} y2={16} />
                  </svg>
                  <div className="grow">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Set the Question
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-neutral-400">
                      Define the question you want to ask your audience. Be
                      creative and clear to get engaging responses.
                    </p>
                  </div>
                </div>
                {/* End Icon Block */}
                {/* Icon Block */}
                <div className="flex gap-x-5">
                  <svg
                    className="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  <div className="grow">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Copy & Share the Link
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-neutral-400">
                      Once your question is set, copy the unique poll link and
                      share it with your audience. You can distribute the link
                      through email, social media, or messaging platforms.
                    </p>
                  </div>
                </div>
                {/* End Icon Block */}
                {/* Icon Block */}
                <div className="flex gap-x-5 ">
                  <svg
                    className="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <div className="grow">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Wait for Responses
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-neutral-400">
                      Sit back and watch as responses start pouring in. Your
                      audience will send one-word answers to your question.
                    </p>
                  </div>
                </div>
                {/* End Icon Block */}
                {/* Icon Block */}
                <div className="flex gap-x-5">
                  <svg
                    className="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div className="grow">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      View the Word Cloud
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-neutral-400">
                      As the responses come in, they will dynamically appear as
                      a word cloud. The more frequent words will be highlighted,
                      creating a visual representation of your audience’s
                      answers.
                    </p>
                  </div>
                </div>
                {/* End Icon Block */}
              </div>
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
        {/* End Features */}
      </div>
    </div>
  );
};

export default Host;
