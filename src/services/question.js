import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie-manager";

export const addQuestion = async (questionData) => {
  const { title, content } = questionData;

  try {
    const apiRequest = await fetch(
      "http://localhost:8000/v1/api/questions/ask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        body: JSON.stringify({ title, content }),
        credentials: "include",
      }
    );

    const data = await apiRequest.json();
    if (data.success) {
      toast.success("Success Add Question", { autoClose: 2000 });
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("add question failed");
    throw new Error("API request failed");
  }
};

export const allQuestion = async () => {
  try {
    const apiRequest = await fetch("http://localhost:8000/v1/api/questions", {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      credentials: "include",
    });

    const data = await apiRequest.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("aadd question failed");
    throw new Error("API request failed");
  }
};

export const myQuestion = async () => {
  try {
    const apiRequest = await fetch(
      "http://localhost:8000/v1/api/questions/myquestions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        credentials: "include",
      }
    );

    const data = apiRequest.json();
    return data;
  } catch (error) {
    console.log(Error);
  }
};

export const deleteQuestion = async (id) => {
  try {
    const apiRequest = await fetch(
      `http://localhost:8000/v1/api/questions/${id}/delete`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        credentials: "include",
      }
    );

    const data = apiRequest.json();
    if (data.success) {
      toast.success("Success delete Question", { autoClose: 2000 });
    }
    return data;
  } catch (error) {
    console.log(Error);
  }
};

export const likeQuestion = async (id) => {
  try {

    const apiRequest = await fetch(`http://localhost:8000/v1/api/questions/${id}/like`,{
      method: "GET",
      headers:{
        Authorization: `Bearer: ${getCookie("access_token")}`,
      }
    });
    const data = apiRequest.json();
    console.log(data)
    return data;

  } catch (error) {
    console.log(error);
  }
};
