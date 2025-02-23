import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
// import { FaTrash } from "react-icons/fa";
import { feed } from "../../../services/auth";
import { getMyLikes } from "../../../services/question";
import { useNotifications } from "../../../context/NotificationContext";
import { io } from "socket.io-client";

function FeedPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [likes, setLikes] = useState([]);
  const { setNotifications, likeNotifications, setLikeNotifications } = useNotifications();
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feedData = await feed();
        setAnnouncements(feedData.data);
        setNotifications([]);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchFeed();
  }, [setNotifications]);

  useEffect(() => {
   
    const fetchLikes = async () => {
     
      try {
        const feedData = await getMyLikes();
        setLikes(feedData.data);
        setLikeNotifications([])
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };

    fetchLikes();
  }, [likeNotifications,setLikeNotifications]); 

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    socket.on("announcement", (newAnnouncement) => {
      setAnnouncements((prevAnnouncements) => [
        newAnnouncement,
        ...prevAnnouncements,
      ]);
    });

    return () => {
      socket.off("announcement");
    };
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);
                
    socket.on("likeNotification", (newData) => {
      setLikes((prevData) => [newData, ...prevData]);
    });

    return () => {
      socket.off("likeNotification");
    };
  }, []);

  return (
    <DashboardLayout>
      <div
        className="bg-gray-800 p-6 rounded-lg overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">
          Admin Duyuruları
        </h2>
        {announcements.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-4xl text-indigo-900">
            Admin tarafından henüz hiç duyuru yok.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-gray-900 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold text-indigo-400 mb-2">
                  {announcement.title}
                </h3>
                <p className="text-gray-200 mb-4">{announcement.content}</p>
                <span className="text-gray-400 text-sm block mb-4">
                  Oluşturma Tarihi:{" "}
                  {new Date(announcement.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-bold text-indigo-400 mb-4 mt-8">
          Genel Duyurular
        </h2>
        {likes.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-4xl text-indigo-900">
            Genel duyurular için henüz hiç içerik yok.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {likes.map((like, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-indigo-400 mb-2">
                  Beğeni #{index + 1}
                </h3>
                <p className="text-gray-200 mb-4">
                  Soru Başlığı: {like.questionId.title}
                </p>
                <span className="text-gray-400 text-sm block mb-4">
                  Beğenen Kullanıcı: {like.likedBy.email}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default FeedPage;
