import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../../../layout/DashboardLayout";
import { deleteQuestion , myQuestion } from '../../../../services/question';
import { FaRegQuestionCircle, FaTrash } from "react-icons/fa";

function MyQuestion() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const fetchMyQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await myQuestion();
      if (data && Array.isArray(data.data)) {
        setQuestions(data.data);
      } else {
        console.error("API did not return a valid array");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching my questions:", error);
      setQuestions([]);
    }
    setIsLoading(false);
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await deleteQuestion(id);
      if(response && response.success) {
        const updatedQuestions = questions.filter(question => question._id !== id);
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          Sorular yükleniyor...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">
          Sorularım
        </h2>
        {questions.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-4xl text-indigo-900">
            Henüz hiç soru sormadınız.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {questions.map((question) => (
              <div key={question._id} className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-indigo-400 mb-2">
                  <FaRegQuestionCircle className="mr-2" />
                  {question.title}
                </h3>
                <p className="text-gray-200 mb-4">{question.content}</p>
                <span className="text-gray-400 text-sm block mb-4">
                  Oluşturma Tarihi: {new Date(question.createdAt).toLocaleDateString()}
                </span>
                <button onClick={() => handleDeleteQuestion(question._id)} className="text-red-500 hover:text-red-700 mt-2">
                  <FaTrash className="inline" /> Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MyQuestion;
