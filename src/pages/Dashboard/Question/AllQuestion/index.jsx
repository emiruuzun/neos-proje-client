import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../../layout/DashboardLayout";
import { allQuestion, likeQuestion } from "../../../../services/question";
import { addAnswers } from "../../../../services/answers";
import { useUser } from "../../../../context/UserContext";
import {
  FaRegUser,
  FaRegQuestionCircle,
  FaThumbsUp,
  FaThumbsDown,
  FaCommentDots,
} from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";

function AllQuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [comment, setComment] = useState("");
  const [likedQuestions, setLikedQuestions] = useState([]);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likers, setLikers] = useState([]);
  const [selectedQuestionTitle, setSelectedQuestionTitle] = useState("");


  const { user } = useUser();
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);

      try {
        const data = await allQuestion();
        if (data && Array.isArray(data.data)) {
          const questionsData = data.data;
          setQuestions(questionsData);

          const userLikedQuestionsIds = questionsData.reduce(
            (acc, question) => {
              const isLikedByUser = question.likes.some(
                (like) => like._id === currentUserId
              );
              return isLikedByUser ? [...acc, question._id] : acc;
            },
            []
          );

          setLikedQuestions(userLikedQuestionsIds);
        } else {
          console.error("API did not return an array inside 'data' property");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [currentUserId]);

  const addComment = async (questionId) => {
    try {
      const newAnswer = await addAnswers({
        content: comment,
        question_id: questionId,
      });

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId
            ? { ...q, answers: [...q.answers, newAnswer] }
            : q
        )
      );

      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const openLikesModal = (questionId) => {
    const question = questions.find((q) => q._id === questionId);
    setLikers(
      question.likes.map((like) => like?.email || "Bilinmeyen kullanıcı")
    );
    setSelectedQuestionTitle(question.title); // Burada başlığı ayarlıyoruz
    setShowLikesModal(true);
  };
  

  const handleLike = async (questionId) => {
    if (likedQuestions.includes(questionId)) {
      return;
    }

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === questionId ? { ...q, likes: [...q.likes, {}] } : q
      )
    );

    try {
      await likeQuestion(questionId);

      setLikedQuestions((prevLiked) => [...prevLiked, questionId]);
    } catch (error) {
      console.error("Like action failed:", error);
    }
  };
  return (
    <DashboardLayout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">
          Topluluğa Hoşgeldiniz
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-300 text-lg">Sorular Yükleniyor...</span>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-scroll grid md:grid-cols-3 gap-4">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-gray-900 p-4 rounded-lg mb-4 shadow-md"
              >
                <h3 className="text-lg font-bold text-indigo-400 mb-2">
                  {question.title}
                </h3>
                <div className="flex items-center mb-2">
                  <FaRegQuestionCircle className="text-gray-500 mr-2" />
                  <p className="text-gray-200">{question.content}</p>
                </div>
                <span className="text-gray-400 text-sm block mb-4">
                  Ekleyen: {question?.user?.email || "Bilinmeyen kullanıcı"}
                </span>
                <div className="flex items-center space-x-6 mb-4">
                  <button
                    className={`flex items-center space-x-2 ${
                      likedQuestions.includes(question._id)
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    } transition duration-300 ease-in-out`}
                    onClick={() => handleLike(question._id)}
                  >
                    <FaThumbsUp />
                    <span>Beğen</span>
                    <span className="ml-2 text-sm text-gray-400">
                      <span
                        className="cursor-pointer"
                        onClick={() => openLikesModal(question._id)}
                      >
                        {question.likes.length}
                      </span>
                    </span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition">
                    <FaThumbsDown />
                    <span>Beğenme</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition"
                    onClick={() => setActiveCommentBox(question._id)}
                  >
                    <FaCommentDots />
                    <span>Cevap Ver</span>
                  </button>
                </div>
                {activeCommentBox === question._id && (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-2 rounded-md"
                      placeholder="Cevabınızı buraya yazın..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button
                      className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                      onClick={() => addComment(question._id)}
                    >
                      Gönder
                    </button>
                  </div>
                )}
                <div className="mt-4 space-y-2 bg-gray-800 p-2 rounded overflow-y-auto max-h-36">
                  {question.answers.length > 0 ? (
                    question.answers.map((answer) => (
                      <div
                        key={answer._id}
                        className="flex space-x-4 items-start bg-gray-900 p-2 rounded"
                      >
                        <FaRegUser className="text-gray-500" />
                        <div>
                          <p className="text-gray-400 text-sm">
                            Cevaplayan: {answer?.user?.email || "Bilinmeyen kullanıcı"}
                          </p>
                          <p className="text-gray-200">{answer.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Henüz cevap verilmemiş.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog.Root open={showLikesModal} onOpenChange={setShowLikesModal}>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed bg-gray-800 p-6 rounded-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-auto">
          <Dialog.Title className="text-lg font-bold text-white mb-4">
            Beğenen Kullanıcılar
          </Dialog.Title>
          <Dialog.Description className="text-gray-300 mb-6">
            {selectedQuestionTitle &&
              `Soru ID: ${selectedQuestionTitle} olan soruyu beğenen kullanıcıların listesi:`}
          </Dialog.Description>
          <ul className="list-disc pl-5 mb-6">
            {likers.map((email, index) => (
              <li key={index} className="text-gray-200 mb-1">
                {email}
              </li>
            ))}
          </ul>
          <Dialog.Close className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
            Kapat
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </DashboardLayout>
  );
}

export default AllQuestionPage;
