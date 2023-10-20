import React, { useState } from 'react';
import DashboardLayout from '../../../../layout/DashboardLayout';
import { addQuestion } from '../../../../services/question';

function QuestionAddPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const questionData = {
            title: title,
            content: content,
        };

        try {
             await addQuestion(questionData);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center space-y-4 bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-indigo-400">Soru Ekle</h2>
                <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="title">Soru Başlığı</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-md bg-gray-900 text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="content">Soru İçeriği</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="mt-1 p-2 w-full h-32 border rounded-md bg-gray-900 text-white resize-y"
                        />
                    </div>
                    <div>
                        <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-800">
                            Soru Ekle
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default QuestionAddPage;
