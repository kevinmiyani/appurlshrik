import React, { useState, useEffect } from "react";
import { common } from "./config/call";

function App() {
  const [fullUrl, setFullUrl] = useState("");
  const [urlLength, setUrlLength] = useState(4);
  const [shortUrls, setShortUrls] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [displayLongUrl, setDisplayLongUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}getpagedata?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setShortUrls(data.shortUrls);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    if (!urlPattern.test(fullUrl)) {
      alert(
        "Please enter a valid URL. The URL must include a protocol (http:// or https://) and a domain name ending in .com, .org, or similar."
      );
      setLoading(false);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("fullUrl", fullUrl);
    formData.append("urlLength", urlLength);

    common
      .addShorlURls(formData.toString())
      .then((res) => {
        fetchData();
        setFullUrl("");
        setUrlLength(4);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCopy = (shortUrl, longUrl) => {
    setDisplayLongUrl(false);
    setCopiedUrl({ short: shortUrl, longUrl: longUrl });
    navigator.clipboard.writeText(shortUrl).then(
      () => {
        console.log("URL copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  const handleRedirect = (shortUrl) => {
    window.open(process.env.REACT_APP_BASE_URL + shortUrl?.short, "_blank");
  };

  const handleShowLongUrl = () => {
    setDisplayLongUrl(true);
  };

  return (
    <div className="bg-gray-200 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Task Overview</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:space-x-4"
        >
          <input
            required
            placeholder="Enter your URL"
            type="url"
            name="fullUrl"
            id="fullUrl"
            className="flex-grow py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            value={fullUrl}
            onChange={(e) => setFullUrl(e.target.value)}
          />
          <input
            required
            placeholder="Desired Length"
            type="number"
            name="urlLength"
            id="urlLength"
            className="w-24 md:w-auto mt-4 md:mt-0 py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            min="4"
            value={urlLength}
            onChange={(e) => setUrlLength(e.target.value)}
          />
          <button
            className="w-full md:w-auto mt-4 md:mt-0 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            type="submit"
          >
            Shrink
          </button>
        </form>
      </div>
      {copiedUrl && (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded border border-gray-300">
          <label className="block font-bold">Copied URL:</label>
          <input
            className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
            type="text"
            value={copiedUrl?.short}
            readOnly
          />
          <div className="flex justify-between">
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              onClick={() => handleRedirect(copiedUrl)}
            >
              Redirect
            </button>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              onClick={handleShowLongUrl}
            >
              Submit
            </button>
          </div>
          {displayLongUrl && (
            <div className="mt-4 break-all">{copiedUrl?.longUrl}</div>
          )}
        </div>
      )}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="max-w-4xl mx-auto mt-8 overflow-x-auto">
          <table className="w-full bg-white rounded border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 border-b border-gray-300">
                  Full URL
                </th>
                <th className="py-2 px-4 bg-gray-200 border-b border-gray-300">
                  Short URL
                </th>
                <th className="py-2 px-4 bg-gray-200 border-b border-gray-300">
                  Clicks
                </th>
                <th className="py-2 px-4 bg-gray-200 border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shortUrls.map((shortUrl, index) => (
                <tr
                  key={shortUrl._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-2 px-4 border-b border-gray-300 max-w-xs overflow-hidden whitespace-nowrap text-overflow-ellipsis ">
                    <a
                      href={shortUrl.full}
                      className="text-blue-500 hover:underline"
                    >
                      {shortUrl.full}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 max-w-xs overflow-hidden whitespace-nowrap text-overflow-ellipsis text-center">
                    <a
                      href={process.env.REACT_APP_BASE_URL + shortUrl.short}
                      className="text-blue-500 hover:underline"
                    >
                      {shortUrl.short}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {shortUrl.clicks}
                  </td>
                  <td className="flex py-2 px-4 border-b border-gray-300 items-center justify-center">
                    <button
                      className="py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                      onClick={() => handleCopy(shortUrl.short, shortUrl.full)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`py-1 px-2 mr-2 bg-gray-300 text-gray-600 rounded ${
                page === 1
                  ? "cursor-not-allowed"
                  : "hover:bg-gray-400 transition duration-300"
              }`}
            >
              Previous
            </button>
            <span className="mx-2">{page}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={shortUrls.length < limit}
              className={`py-1 px-2 mr-2 bg-gray-300 text-gray-600 rounded ${
                shortUrls.length < limit
                  ? "cursor-not-allowed"
                  : "hover:bg-gray-400 transition duration-300"
              }`}
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="py-1 px-2 bg-gray-300 text-gray-600 rounded focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
