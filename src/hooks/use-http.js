import { useCallback, useState } from "react";

const useHttp = (applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : "GET",
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        });

        if (!response.ok) {
          throw new Error("Request failed!");
        }

        const data = await response.json();
        applyData(data);
        //   const loadedTasks = [];
        //   for (const taskKey in data) {
        //     loadedTasks.push({ id: taskKey, text: data[taskKey].text });
        //   }
        //   setTasks(loadedTasks);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    [applyData]
  );
  return {
    // isLoading: isLoading,
    // error: error,
    // sendRequest: sendRequest
    isLoading,
    error,
    sendRequest,
  };
};
export default useHttp;

// ~~ BULDING A CUSTOM HTTP HOOK ~~
// Don't forget: "use"!
// Make usage custom http request hook
// STEP: 1
// 1.1 From App Component cut code ("fetchTasks") with states
// 1.2 Rename "fetchTasks" to "sendRequest". This hook should be able to send any kind of requests to any kind of URL and do any kind of data transformation, but it should always manage the same state loading and error and execute the same steps in the same order.
// 1.3 For make this hook more flexible (to configure this hook) -> need add some parameters in useHttp(). Request logic should be configurable -> URL, but also the methods, the body, the headers (need to be flexible). "useHttp = (requestConfig) => {..."
// 1.4 "requestConfig" - this should be an object, which contains the URL and any kind of other configuration
// 1.5 In "response" add "requestConfig.url", since we will be calling that hook, we then have to make sure that we pass in an object, which has a URL property, which holds the URL
// 1.6 This hook should also be usable for post requests, so "fetch" should take a second argument -> pass the object with the "method: requestConfig.method" (headers the same), "body: JSON.stringify(requestConfeg.body)"
// 1.7 We perform the JSON transformation inside of the hook but the body itself has passed from outside
// STEP: 2
// Next transformation steps can be defined in the component where is hook is being used.
// 2.1 Add new parameter to "useHttp" -> "const useHttp = (requestConfig, applyData)". "applyData" is a function.
// 2.2 Then, once we got the data, we call "applyData" and passed the data to it "applyData(data)". So that in the hook we just hand the data off and the function itself and what happens in there is providedby the component that uses the custom hook
// Reuse logic in the hook, but the specific steps that should be taken with the data in the components that uses the hook.
// That custom component should to then have access to the "isLoading" and the "errorState" and it should have access to the "sendRequest" function so that it's the component which can trigger a "sendRequest"
// 2.3 In the end of the custom hook (not at the end of "sendRequest"), but at the end of custom hook function, I wanna return something to the component where is custom hook is used.
// 2.4 This "return" will return property "isLoading" which points at the "isloading" state constant (from useState). Also return "error: error" and "sendRequest: sendRequest" - this "sendRequest" is function.
// 2.5 Update to shortcut: "isLoading, error, sendRequest"
// AFTER THIS FO TO APP COMPONENT AND USE CUSTOM HOOK
// ~~ BULDING A CUSTOM HTTP HOOK ~~
// ("https://react-project-angve-2-default-rtdb.firebaseio.com/tasks.json");

// ~~ USING THE CUSTOM HOOK ~~
// CAME FROM App.js
// STEP 2:
// 2.1 Let's tweak configuration of fetch request in "sendRequest".
// 2.2 "requestConfig.method" is set, and only if set, I apply it here and otherwise I set this to GET as a default. ("requestConfig.method ? requestConfig.method : 'GET'").
// 2.3 "requestConfig.headers ? requestConfig.headers : {}"
// 2.4 The same for body: "body: requestConfig.body ? JSON.stringify(requestConfig.body) : null"
// GO BACK to App.js
// ~~ USING THE CUSTOM HOOK ~~

//

// ~~ ADJUSTING THE CUSTOM HOOK LOGIC ~~
// CAME FROM App.js
// "useEffect" (where we use custm hook) would treat recreated function as a new value even if it's the same function and it would re-execute it. To avoid, we should:
// STEP 1:
// 1.1 Wrap "sendRequest" with "useCallback".
// 1.2 "useCallback" always needs of dependency array, this dependency array also should list everything which is being used in there ("requestConfing" object and "applyData(data)" function which recalling)
// 1.3 Add as a dependency "[requestConfig, applyData]"
// GO TO App.js --->>>
// CAME FROM App.js
// STEP: 3
// 3.1 Instead of accepting the "requestConfig" in the hook itself ("useHttp"), why don't we expect that here in the "sendRequest" function after all that is the function which is being called with that 'requestConfig --- >>> remove "requestConfig" from "useHttp" as parameter, and add to "sendRequest"
// 3.2 Remove "requestConfig" from dependency because it's now a parameter of this wrapped function not an external dependency
// GO TO App.js --->>>
// ~~ ADJUSTING THE CUSTOM HOOK LOGIC ~~
