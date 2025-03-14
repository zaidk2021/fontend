import Sidebar from "@/components/Sidebar";
import { db } from "@/db/firebase";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Scrollbars from "react-scrollbars-custom";
import Image from 'next/image'
import dynamic from "next/dynamic";
import Head from "next/head";
import Question from "@/components/Question";

const EditableMathField = dynamic(() => import("react-mathquill"), {
  ssr: false,
});



export default function UploadPaper({selectedValue,activeCategoryName,categoryTitle}) {
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);


 

  const navigateToQuestion = (index) => {
    setActiveIndex(index);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "Untitled Question",
        options: { a: "", b: "", c: "", d: "" },
        answer: "",
      },
    ]);
    console.log(questions);
  };
  const deleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const duplicateQuestion = (index) => {
    const duplicatedQuestion = { ...questions[index] };
    setQuestions([...questions, duplicatedQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleTestNameChange = (e) => {
    setTestName(e.target.value);
  };

  const handleUploadTest = async () => {
    if (testName.trim() === "") {
      alert("Test name cannot be empty");
      return;
    }
    try {
      // Add the test name to the "tests" collection
      await setDoc(doc(db, "available-tests", testName), {
        test: questions,
      });

      alert("Test uploaded successfully!");
      setTestName("");
      setQuestions([]);
    } catch (error) {
      console.error("Error uploading test:", error);
      alert("An error occurred while uploading the test.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 grid grid-cols-[5fr,1fr] gap-4">
      {/* Left Column */}
      <Scrollbars style={{ height: "calc(100vh - 64px)" }}>
        <h1 className="text-2xl font-semibold mb-4">Questionnaire</h1>
        {questions.map((q, index) => (
          <Question key={index} q={q} index={index} deleteQuestion={deleteQuestion} duplicateQuestion={duplicateQuestion} updateQuestion={updateQuestion} />
        ))}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          onClick={addQuestion}
        >
          Add Question
        </button>

        <div className="my-4">
            
          <h2 className="text-xl font-semibold mb-2">Create Test</h2>
          <p><span className="text-red-400">Warning:</span>the test will be uploaded in :</p>
          {activeCategoryName}{"/"}{categoryTitle}{"/"}{selectedValue}
          
          <input
            className="border rounded px-2 py-1 mr-2"
            type="text"
            placeholder="Test Name"
            value={testName}
            onChange={handleTestNameChange}
          />
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={handleUploadTest}
          >
            Upload Test
          </button>
        </div>
      </Scrollbars>
      {/* Sidebar Navigation */}
      <Sidebar
        questions={questions}
        activeIndex={activeIndex}
        onNavigate={navigateToQuestion}
      />
    </div>
  );
}
