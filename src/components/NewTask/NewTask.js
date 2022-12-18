// import { useState } from "react";

import Section from "../UI/Section";
import TaskForm from "./TaskForm";
import useHttp from "../../hooks/use-http";

const NewTask = (props) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };
    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    sendTaskRequest(
      {
        url: "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { text: taskText },
      },
      createTask.bind(null, taskText)
    );
    // setIsLoading(true);
    // setError(null);
    // try {
    //   const response = await fetch(
    //     "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({ text: taskText }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Request failed!");
    //   }

    //   const data = await response.json();

    //   const generatedId = data.name; // firebase-specific => "name" contains generated id
    //   const createdTask = { id: generatedId, text: taskText };

    //   props.onAddTask(createdTask);
    // } catch (err) {
    //   setError(err.message || "Something went wrong!");
    // }
    // setIsLoading(false);
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;

// ~~ USE CUSTOM HOOK IN OTHER COMPONENT ~~
// STEP: 1
// 1.1 Import "useHttp"
// 1.2 Call this "useHttp" no longer need to pass in any parameters
// Store "useHttp" with destruct: "const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();"
// 1.3 In the "enterTaskHandler" wanna call "sendTaskRequest", because we wanna send that request whenever "enterTaskHandler" is triggered which happens when that form was submitted in the end ("onEnterTask={enterTaskHandler}")
// 1.4 Need to ensure that we pass the proper configuration and data handling function to send request. Let's start with the config object, where "url" is set to thei "URL", with "method: "POST", with "headers" and body (NOT JSON, because we're doing that JSON transformation inside of the custom hook) - > just send in this object "{ text: taskText }" here, which I previously changed to JSON in the "NewTask" Component.
// 1.5 "sendTaskRequest" - that's, which takes the response data and does something with it: extract the generated ID (which Firebase gives me automatically (ID)), wanna "createdTask" object, which incorporates that ID, and I then when I call props "onAddTask"
// 1.6 Let's create function (second argument of "sendTaskRequest") it in advance. "const createTask = (taskData) => {}"
// 1.7  In this function "createTask" we add logic for extract ID from Firebase, "createdTask" object, and add props ("onAddTask")
// 1.8 Add "createTask" into "sendTaskRequest" as a second aqrgument.
// We won't have the problem of an infinite loop, because this "sendTaskRequest" will not be sent whenever the component is re-evaluated, but only when this "enterTaskHandler" function runs, which happens when the form is submitted ("onEnterTask={enterTaskHandler}")
// 1.9 Add new argument: "const createTask = (taskText, taskData)", but our custom hook ("enterTaskHandler"), which is calling "createTask" only passes in one parameter (it only passes the data (in use-http.js)) -- >> need ".bind"
// 1.10 Could "bind" on "createTask", when we pass it to "sendTaskRequest". Bind method allows us to pre-configure a function. It doesn not execute the function right away. The first argument you pass to bind then allows you to set the this keyword in the to-be-executed function - which does not matter, then set it to "null". But the second argument received will then be the first argument received by that to-be-called function "createTask" -> "taskText" ("createTask.bind(null, taskText)"), because that wil then refer to the "taskText" we're getting from the form submission.
// Now the other argument "taskData" will still be received in function "createTask", because this is our pre-configuration. Any other arguments which might be passed by the place where the function is then actually being called which happens in "useHttp", will then simply be appended to the end of the parameter list.
// So the data which we pass here (in use-http.js -> "applyData(data)") as the only argument to apply data in the custom hook, will be appended as a second argument on "createTask" because of I calling "bind"
// ~~ USE CUSTOM HOOK IN OTHER COMPONENT ~~
