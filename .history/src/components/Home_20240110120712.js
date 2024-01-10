import React, { useState, useEffect } from "react";
import "./Home.css";
import {useNavigate} from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
// import { FaEdit } from "react-icons/fa";
const Home = () => {

  
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  const [editData, setEditData] = useState(false);
  const [selectedData, setSelectedData] = useState("");

  const [Result, setResult] = useState("");
  const [Services, setServices] = useState("");
  const [Type, setType] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  
  const [image, setImage] = useState(null);
  // const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", type === "image" ? "images" : "videos");
    try {
      let cloudName = "dscmtg4tx";
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      // console.log(res);
      const { secure_url } = res.data;
      // console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      //upload image
      const imageUrl = await uploadFile("image");

      //upload video
      // const videoUrl = await uploadFile("video");

      //sending backend api request
      await axios.post("http://localhost:5000/api/videos", { imageUrl });

      //reset states
      setImage(null);
      // setVideo(null);

      console.log("File uploaded successfully");

      setLoading(false);
      toast.success("uploaded successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    } 
  };


  useEffect(() => {
    // Fetching data from the server
    axios
      .get("http://localhost:5000/api/videos")
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [results]);

  const formatDate = (timestamp) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  const deleteData = async (id) => {
    const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      toast.success("Deleted Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const updateData = async (id) => {
    const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl, Services, Type, Result }),
    });

    if (response.status === 200) {
      toast.success("Data updated Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* toaster */}
      <Toaster position="top-center" reverseOrder={false} />
      {/* toaster */}

      <div className="input-file">


        <div>
          <img src=
        </div>



        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={(e) => setImage((prev) => e.target.files[0])}
          />
          <label for="fileInput" class="custom-file-label">
            Choose a File
          </label>

          <button className="upload-button" type="submit">
            Upload
          </button>
          {loading && (
            <ColorRing
              visible={true}
              height="30"
              width="30"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
        </form>
      </div>







      <div className="table-data-container">
        <table className="tablestyle">
          <thead>
            <tr>
              <th>Reviewd?</th>
              <th></th>
              <th className="th1">Type</th>
              <th>Date / Timestamp</th>
              <th>Spotted at Location</th>
              <th>Result</th>
              <th>Services</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>
                  <AiFillDelete
                    className="delete text-secondary"
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                    onClick={() => deleteData(result._id)}
                  ></AiFillDelete>

                  {/* <FaEdit
                    onClick={() => {
                      setEditData((prevEditData)=> !prevEditData);
                      setSelectedData(result._id);
                    }}
                    className={`${
                      selectedData === result._id && editData
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  text-gray-400 hover:text-red-400 cursor-pointer 
                  scale-110 transition-all`}
                    style={{ cursor: "pointer" }}
                  ></FaEdit> */}
                </td>

                <td>
                  <img
                    className="table-data-image"
                    src={result.imageUrl} // Assuming your API response has an imageUrl property
                    alt=""
                    contentEditable={editData}
                    onInput={(e) => setImageUrl(e.currentTarget.innerText)}
                  />
                </td>
                <td
                  contentEditable={editData}
                  onInput={(e) => setType(e.currentTarget.innerText)}
                >
                  {result.Type}
                </td>
                <td>{formatDate(result.createdAt)}</td>
                <td></td>
                <td
                  contentEditable={editData}
                  onInput={(e) => setServices(e.currentTarget.innerText)}
                >
                  {result.Result}
                </td>
                <td
                  contentEditable={editData}
                  onInput={(e) => setResult(e.currentTarget.innerText)}
                >
                  {result.Services}
                </td>

                {/* <button
                  className={`${
                    selectedData === result._id && editData ? "block" : "hidden"
                  }
                     bg-purple-400 hover:bg-purple-600 
                     px-3 py-1 my-1 rounded-md font-bold text-white`}
                   onClick={() => { 
                    updateData(result._id);
                    setEditData(false);
                    
                   }}
                >
                  Save
                </button> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
