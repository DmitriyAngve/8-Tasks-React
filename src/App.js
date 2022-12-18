import React, { useCallback, useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  const transformTasks = useCallback((tasksObj) => {
    const loadedTasks = [];

    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }

    setTasks(loadedTasks);
  }, []);

  // const { isLoading, error, sendRequest } = httpData;
  const { isLoading, error, sendRequest: fetchTasks } = useHttp(transformTasks);

  // const fetchTasks = async (taskText) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(
  //       "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json"
  //     );
  //     console.log(response);

  //     if (!response.ok) {
  //       throw new Error("Request failed!");
  //     }

  //     const data = await response.json();

  //     // const loadedTasks = [];
  //     // for (const taskKey in data) {
  //     //   loadedTasks.push({ id: taskKey, text: data[taskKey].text });
  //     // }
  //     // setTasks(loadedTasks);
  //   } catch (err) {
  //     setError(err.message || "Something went wrong!");
  //   }
  //   setIsLoading(false);
  // };

  useEffect(() => {
    fetchTasks(
      "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json"
    );
  }, [fetchTasks]);

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
// CAME FROM use-http.js
// STEP 3:
// After STEP 2 the custom hook should be flexible enough so that "useHttp" can just pass in an object that looks like this: "useHttp({    url: "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json",})"
// 3.1 Let's provide second argument, which is that function which receives the data here in the end (a"pplyDara(data)")
// 3.1 Let's define a function. Define it before call "useHttp". Implement function "transformTasks". Here i then expect top get my "tasksObj" ("const transformTasks = (tasksObj) => {}")
// 3.2 Inside "transformTasks" I apply the transformation logic which we had in use-HTTP JS before I deleted it -> "const loadedTasks"; "for (const taskKey in data) {..."; "setTasks(loadedTasks)" Add in a "trasformTasks"
// 3.3 In the "tasksObj" through which I wanna loop (for in loop), with that transform all the tasks from objects which get back from firebase into objects that have the structure and format I need for my front-end.
// 3.4 Add "transformTasks" function in "useHttp" as a second argument. And then this function will be called for us the custom hook whenever we got a response.
// "useHttp" does not just required parameters is also returned something, it returns object from "use-http.js" with loading and error states and the a pointer at the "sendRequest" function which we ultimately will need to call to trigger that request.
// 3.5 Store "useHttp" to "httpData" and desctr it and I pull out "isLoading", "error" and "sendRequest"
// 3.6 Rename property from custom hook "sendRequest: fetchTasks" inside this component function
// 3.7 Will rid old "fetchTasks" but hold "useEffect" with "fetchTasks" and use "fetchTasks" as a dependecy (will be infinite loop)
// 3.8 Whenevere "fetchTasks" changes app rerun "useEffect".
// ~~ USING THE CUSTOM HOOK ~~

// ~~ ADJUSTING THE CUSTOM HOOK LOGIC ~~
// If we add "fetchTasks" that create an infinite loop, Because we will cal "fetchtasks" in "useEffect(() => {fetchTasks})" and this will then gop ahead and execute "sendRequest" function from use-http.js in the custom hook (" sendRequest: fetchTasks,} = useHttp(...)" and that will then set some states, when the states are set (look at use-http.js) the component where we use the custom hook will be re-rendered, because when we use a custom hook, which use state and you use that hook in that component that component will implicitly use that state set up in the custom hook. The state configured in the custom hook is attached to the component where you use the custom hook
// So if we call "setIsLoading" and "setError" (look at use-http.js) in the "sendRequest" function in the custom hook this will trigger the APP component to be re-evaluated because I'm using that custom hook here in that component ("const { isLoading, error, sendRequest: fetchTasks }" = useHttp({url: "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json",},transformTasks);)"
// Then call then custom hook again when that component is re-evaluated and when that custom hook is called again, I'm recreating the "sendRequest" function and I'm returning a new function object and "useEffect" will run again ("useEffect(() => {fetchTasks();},[fetchTasks]);"). That happens because function are objects in JavaScript. And every time a function is recreated even if it contains the same logic it's a brand new object in memory and therefore "useEffect" would treat it as a new value even if it's the same function and it would re-execute it.
// To avoid this, we should GO TO use-http.js --->>>
// STEP 2:
// 2.1 Import useCallback
// 2.2 Wrap "transformTasks" with "useCallback" with empty dependency because in here I'm not using anything external other than set tasks which is a state updating function (these are guaranteed to never change: "setTasks(loadedTasks)")
// transformTasks will not change all the time, but this object: "url: "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json" will, we are recreating it here all the time whenever the App component is re-evaluated, so to work around that, we could use "useMemo" to ensure that this object doesn't chenge all the time or change custom hook again
// GO TO use-http.js --- >>>>
// CAME FROM use-http.js
// STEP: 4
// 4.1 We gonna rid "url: "https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json" so that "transformTasks" is the only function we're passing to "useHttp" ("useHttp(transformTasks)")
// 4.2 And we then go to "fetchTasks" where we are sending the request in the end (keep in mind "fetchTasks" is a "sendRequest"). We pass our config object here: "fetchTasks("https:react-project-angve-2-default-rtdb.firebaseio.com/tasks.json");"
// 4.3
// ~~ ADJUSTING THE CUSTOM HOOK LOGIC ~~
