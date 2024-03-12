import { useState, useEffect } from "react";

function App() {
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://youtube138.p.rapidapi.com/auto-complete/?q=desp&hl=en&gl=US";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "a2be3a337bmsh8bb6f58e6d3dbfap191716jsnc188ab19a3f6",
          "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.text();
        setResponseData(result); // Set the fetched data into state
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <>{/* Your JSX content goes here */}</>;
}

export default App;
