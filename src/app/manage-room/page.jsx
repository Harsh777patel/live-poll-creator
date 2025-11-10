"use client";
import {
  IconCheck,
  IconDoorEnter,
  IconLoader3,
  IconTrash,
} from "@tabler/icons-react";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";

const ManageSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name is required"),
  title: Yup.string().required("Title is required"),
});

const ManageRoom = () => {
  const router = useRouter();

  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoomList = async () => {
    setLoading(true);
    const res = await axios.get("https://live-poll-backend-akq0.onrender.com/room/getall");
    console.log(res.data);
    setRoomList(res.data);
    setLoading(false);
  };

  const manageForm = useFormik({
    initialValues: {
      title: "",
      name: "",
    },

    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .post("https://live-poll-backend-akq0.onrender.com/room/add", values)
        .then((result) => {
          toast.success("Room Created successfully!");
          resetForm();
          fetchRoomList();
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || "Something went wrong!");
          setSubmitting(false);
        });
    },
    validationSchema: ManageSchema,
  });

  useEffect(() => {
    fetchRoomList();
  }, []);

  const deleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this room")) return;

    const res = await axios.delete(`https://live-poll-backend-akq0.onrender.com/room/delete/${id}`);
    if (res.status === 200) {
      fetchRoomList();
      toast.success("Room Deleted Successfull");
    } else {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="bg-cover min-h-screen bg-violet-300 text-black pt-4 p-8">
      <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-neutral-400 ">
        Create a Room for the Poll
      </h1>
      <p className="text-xl p-1 font-semibold text-center text-gray-900 dark:text-neutral-400 ">
        Build Your Poll Room in Just a Few Clicks
      </p>
      {/* <button
        className="text-2xl font-bold mt-8 text-gray-700 text-center bg-white px-4 py-2 rounded-lg"
        type="submit"
        onClick={addNewRoom}
      >
        <IconSquarePlus />
        Create Room
      </button> */}
      <div className="bg-gray-100 w-full mt-6 p-4 rounded-lg flex flex-col md:flex-row gap-6">
        {/* Form Section */}
        <div className="text-gray-800 md:w-1/2 p-8">
          <form onSubmit={manageForm.handleSubmit}>
            <div className="mx-auto items-center rounded-xl p-4">
              <h1 className="font-bold text-3xl mb-4 text-center">
                Create Room
                <p className="text-lg font-semibold p-1">
                  Ready to Host? Create Room & Connect with Your Audience...
                </p>
                <img
                  src="/Vote.png"
                  alt="Poll"
                  className="rounded-lg w-1/2 mx-auto hidden sm:block"
                />
              </h1>

              <label className="text-lg text-black">
                Title of the room:
                <input
                  id="title"
                  type="text"
                  placeholder="Title..."
                  className="rounded-lg px-3 py-2 border block w-full mb-4 bg-gray-200"
                  onChange={manageForm.handleChange}
                  value={manageForm.values.title}
                />
              </label>
              {manageForm.errors.title && manageForm.touched.title && (
                <p className="text-xs text-red-600 mt-2">
                  {manageForm.errors.title}
                </p>
              )}

              {/* Name Input */}
              <label className="text-lg text-black">
                Name of the Creator:
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name..."
                  className="rounded-lg px-3 py-2 border block w-full bg-gray-200"
                  onChange={manageForm.handleChange}
                  value={manageForm.values.name}
                />
              </label>
              {manageForm.errors.name && manageForm.touched.name && (
                <p className="text-xs text-red-600 mt-2">
                  {manageForm.errors.name}
                </p>
              )}

              {/* Submit Button */}
              <button
                className="bg-green-600 text-white px-3 py-2 rounded-xl mt-4 flex items-center justify-center w-full gap-2"
                type="submit"
                disabled={manageForm.isSubmitting}
              >
                {manageForm.isSubmitting ? (
                  <IconLoader3 className="animate-spin" />
                ) : (
                  <IconCheck />
                )}
                {manageForm.isSubmitting ? "Creating..." : "Create a Room"}
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src="/ManageRoom.png"
            alt="Poll"
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>

      {/* Manage Room */}
      <div className="mt-12">
        <h1 className="text-center text-gray-900 dark:text-neutral-400 font-bold text-4xl">
          Manage Rooms
        </h1>

        <p className="text-lg text-center font-semibold p-2">
          Quick Access to Your Poll Room Details. View, Enter, or Delete Your
          Poll Room
        </p>
      <div className="container mx-auto text-black w-full shadow-xl overflow-x-auto">
        {loading ? (
          <p className="text-center text-black text-4xl font-bold mt-4">
            Loading... Please Wait
            <IconLoader3 className="animate-spin mx-auto font-bold" />
          </p>
        ) : (
          <table className="mt-4 min-w-full ">
            <thead className="border border-violet-700 text-white bg-violet-900">
              <tr>
                <th className="p-2">Room Id</th>
                <th className="p-2">Room Title</th>
                <th className="p-2">Created By</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Set Question</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 text-center">
              {roomList.map((room) => (
                <tr key={room._id} className="border border-gray-200">
                  <td className="p-2 border">{room._id}</td>
                  <td className="p-2 border">{room.title}</td>
                  <td className="p-2 border">{room.name}</td>
                  <td className="p-2 border">
                    {new Date(room.createdAt).toDateString()}
                  </td>
                  <td className="p-2 border">
                    <Link
                      className="bg-violet-500 flex w-fit text-white px-2 py-1 rounded-full mx-auto gap-2"
                      href={"/host/" + room._id}
                    >
                      Enter to {room.title}
                      <IconDoorEnter />
                    </Link>
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-red-500 flex w-fit text-white px-2 py-1 rounded-full mx-auto gap-2"
                      onClick={() => deleteRoom(room._id)}
                    >
                      Delete {room.title}
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
};

export default ManageRoom;
