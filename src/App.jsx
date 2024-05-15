import React, { useState, useEffect } from "react";
import "./App.css";
import { common } from "./config/call";

function App() {
  const [fullUrl, setFullUrl] = useState("");
  const [urlLength, setUrlLength] = useState(4);

  const [shortUrls, setShortUrls] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [displaylongurl, setDisplaylongurl] = useState(false);
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

  const fetchShortUrls = async () => {
    setLoading(true);

    common
      .getShortUrls()
      .then((res) => {
        setShortUrls(res?.data.shortUrls);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(\/[^\s]*)?$/;

    if (!urlPattern.test(fullUrl)) {
      /* eslint-disable-next-line */
      alert(
        "Please enter a valid URL. The URL must include a protocol (http:// or https://) and a domain name ending in .com, .org, or similar."
      );
      return;
    }

    const formData = new URLSearchParams();
    formData.append("fullUrl", fullUrl);
    formData.append("urlLength", urlLength);

    common
      .addShorlURls(formData.toString())
      .then((res) => {
        fetchShortUrls();
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

  const handleCopy = (shortUrl, longurl) => {
    setDisplaylongurl(false);
    setCopiedUrl({ short: shortUrl, longurl: longurl });
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
    window.open(process.env.REACT_APP_BASE_URL + shortUrl, "_blank");
  };

  const handleonSubmit = () => {
    setDisplaylongurl(true);
  };
  return (
    <div className="content">
      <h1>URL Shrinker</h1>
      <form onSubmit={handleSubmit} className="my-4 form-inline">
        <label htmlFor="fullUrl" className="sr-only">
          Url
        </label>
        <input
          required
          placeholder="Url"
          type="url"
          name="fullUrl"
          id="fullUrl"
          className="form-control col mr-2 my-input"
          value={fullUrl}
          onChange={(e) => setFullUrl(e.target.value)}
        />
        <label htmlFor="urlLength" className="sr-only">
          Length
        </label>
        <input
          required
          placeholder="Desired Length"
          type="number"
          name="urlLength"
          id="urlLength"
          className="form-control col mr-2 my-input"
          min="4"
          value={urlLength}
          onChange={(e) => setUrlLength(e.target.value)}
        />
        <button className="btn btn-custom" type="submit">
          Shrink
        </button>
      </form>
      {copiedUrl && (
        <>
          <div
            style={{
              margin: 10,
            }}
          >
            <label>Copied URL: </label>
            <input
              className="form-control"
              type="text"
              value={copiedUrl?.short}
              readOnly
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleRedirect(copiedUrl)}
            >
              Redirect
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleonSubmit()}
            >
              Submit
            </button>
          </div>
          {displaylongurl && <div>{copiedUrl?.longurl}</div>}
        </>
      )}
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Full URL</th>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shortUrls.map((shortUrl) => (
                  <tr key={shortUrl._id}>
                    <td className="full-url">
                      <a href={shortUrl.full}>{shortUrl.full}</a>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        width: "100px",
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line */}
                      <a href={process.env.REACT_APP_BASE_URL + shortUrl.short}>
                        {shortUrl.short}
                      </a>
                    </td>
                    <td>{shortUrl.clicks}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm mr-2"
                        onClick={() =>
                          handleCopy(shortUrl.short, shortUrl.full)
                        }
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>{page}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={shortUrls.length < limit}
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
