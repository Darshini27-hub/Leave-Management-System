
import { useState, useEffect } from "react";
import getError from "../utils/getError";

const useFetch = (apiFunction, params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const paramsText = JSON.stringify(params);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await apiFunction(params);
        setData(res.data.data);
        setError("");
      } catch (err) {
        setError(getError(err));
      }
      setLoading(false);
    };
    loadData();
  }, [paramsText, reloadCount]);

  const reload = () => setReloadCount(reloadCount + 1);

  return { data, loading, error, reload };
};

export default useFetch;