import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { getMyAnswer } from "../../../services/answers";
import { FaRegQuestionCircle } from "react-icons/fa";

function MyAnswers() {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyAnswers();
  }, []);

  const fetchMyAnswers = async () => {
    setIsLoading(true);
    try {
      const data = await getMyAnswer();
      if (data && Array.isArray(data.data)) {
        setAnswers(data.data);
      } else {
        console.error("API did not return a valid array");
        setAnswers([]);
      }
    } catch (error) {
      console.error("Error fetching my answers:", error);
      setAnswers([]);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          Cevaplar yükleniyor...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Cevaplarım</h2>
        {answers.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-4xl text-indigo-900">
            Henüz hiç cevap vermediniz.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {answers.map((answer) => (
              <div
                key={answer._id}
                className="bg-gray-900 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold text-indigo-400 mb-2">
                  <FaRegQuestionCircle className="mr-2" />
                  {answer.question
                    ? answer.question.title
                    : "Başlık Bilinmiyor yada Soru Silinmiş"}
                </h3>
                <p className="text-gray-200 mb-4">{answer.content}</p>
                <span className="text-gray-400 text-sm block mb-4">
                  Cevap Tarihi: {new Date(answer.createAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyAnswers;
