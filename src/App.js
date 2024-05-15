import React, { useState, useEffect } from "react";
import "./App.css";
import { common } from "./config/call";

function App() {
  const [fullUrl, setFullUrl] = useState("");
  const [urlLength, setUrlLength] = useState(4);

  const [shortUrls, setShortUrls] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState("");

  const fetchShortUrls = async () => {
    common
      .getShortUrls()
      .then((res) => {
        console.log("===>.>", res);
        setShortUrls(res?.data.shortUrls);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchShortUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullUrl) {
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
      });
  };

  const handleCopy = (shortUrl) => {
    setCopiedUrl(shortUrl);
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
    window.open("https://short-link-jade.vercel.app/" + shortUrl, "_blank");
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
        <div
          style={{
            margin: 10,
          }}
        >
          <label>Copied URL: </label>
          <input
            className="form-control"
            type="text"
            value={copiedUrl}
            readOnly
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleRedirect(copiedUrl)}
          >
            Redirect
          </button>
        </div>
      )}

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
                <td>
                 <a href= href={"https://short-link-jade.vercel.app/" + shortUrl.short}>{shortUrl.short}</a>
                </td>
                <td>{shortUrl.clicks}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm mr-2"
                    onClick={() => handleCopy(shortUrl.short)}
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
