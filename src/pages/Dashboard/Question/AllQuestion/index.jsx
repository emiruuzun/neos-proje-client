import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layout/DashboardLayout';
import { allQuestion } from '../../../../services/question';
import { FaRegUser, FaRegQuestionCircle, FaThumbsUp, FaThumbsDown, FaCommentDots } from 'react-icons/fa';

function AllQuestionPage() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCommentBox, setActiveCommentBox] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await allQuestion();
                if (data && Array.isArray(data.data)) {
                    setQuestions(data.data);
                } else {
                    console.error("API did not return an array inside 'data' property");
                    setQuestions([]);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                setQuestions([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    return (
        <DashboardLayout>
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">Topluluğa Hoşgeldiniz</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-gray-300 text-lg">Sorular Yükleniyor...</span>
                    </div>
                ) : (
                    <ul>
                        {questions.map(question => (
                            <li key={question._id} className="bg-gray-900 p-4 rounded-lg mb-4">
                                <h3 className="text-lg font-bold text-indigo-400">{question.title}</h3>
                                <div className="flex items-center mt-2">
                                    <FaRegQuestionCircle className="text-gray-500 mr-2" />
                                    <p className="text-gray-200">{question.content}</p>
                                </div>
                                <span className="text-gray-400 text-sm mt-2 block">Ekleyen: {question.user.email}</span>
                                <div className="flex items-center space-x-6 mt-6">
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition">
                                        <FaThumbsUp />
                                        <span>Beğen</span>
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
                                        <span>Yorum Yap</span>
                                    </button>
                                </div>

                                {activeCommentBox === question._id && (
                                    <div className="mt-4">
                                        <textarea 
                                            className="w-full p-2 rounded-md"
                                            placeholder="Yorumunuzu buraya yazın..."
                                        ></textarea>
                                        <button className="mt-2 bg-blue-500 text-white p-2 rounded-md">
                                            Gönder
                                        </button>
                                    </div>
                                )}

                                <div className="mt-6 space-y-4">
                                    <div className="flex space-x-4 items-start">
                                        <FaRegUser className="text-gray-500" />
                                        <div>
                                            <p className="text-gray-600">Yorumcu Adı</p>
                                            <p className="text-gray-500">Bu bir örnek yorumdur.</p>
                                        </div>
                                    </div>
                                    {/* Diğer yorumlar... */}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
}

export default AllQuestionPage;
