import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  useHttp({
    url: "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json",
  });

  const fetchTasks = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json"
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();

      const loadedTasks = [];

      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text });
      }

      setTasks(loadedTasks);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;

// ~~ USING THE CUSTOM HOOK ~~
// CAME FROM use-http.js
// STEP: 1
// 1.1 Import it.
// 1.2 Get rid two "useState()"'s. And call "useHttp()".
// 1.3 Custom hook needs some arguments, cuz we expect two parameters: "requestConfig" and "applyData". We pass in an object with URL property (because inside of the custom hook we are accessing a URL property in "response"). Pass in this String with "firebase"
// GO TO use-http.js
//
// ~~ USING THE CUSTOM HOOK ~~
