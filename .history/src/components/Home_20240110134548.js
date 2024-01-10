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
          <img src="https://i.ibb.co/tmwqkpj/logo.png" alt="website-logo"/>
        </div>
        <div className="card1">
          <h1>Total Signages</h1>
          <h1>10</h1>
        </div>

        <div className="card2">
          <h1>To be revised</h1>
          <h1>3</h1>
        </div>
        
        <div className="card3">
          <h1>Accuracy last 7days</h1>
          <h1>70%</h1>
        </div>


        <form className="form" onSubmit={handleSubmit}>
         
         <div>
          <input 
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={(e) => setImage((prev) => e.target.files[0])}
          />
          <label for="fileInput" class="custom-file-label">
            Choose a File
          </label>
          </div>


          <div>
          <button className="upload-button" type="submit">
            Upload
          </button>
          </div>
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
    

    <div className="bg2">
     <div>
      <input id="checkbox" type="checkbox"/>
      <label htmlFor="checkbox">show only remainig to be revised</label>
     </div>

     <div className="flexDelete">
      <div>
        <button className="delete">Delete filtered data</button>
      </div>
      <div>
        <button className="getStarted">Get street address</button>
      </div>

      
      <div className="cardBg-white">
        <p>SEARCH(BY LOCATION,DATE,KEYWORDS,DETAILS...)</p>
      <div>
        <input className="searchBar" type="search" placeholder="Search..." id="search"/>
        <label htmlfor="search">
          <button className="search" type="button">Search</button>
        </label>
      </div>
      </div>
     </div>
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

        
        <div className="bottom-box">
          <div>
            <inpt type="checkbox"/>
            <p>show only remainig to be reviewed</p>
          </div>
         
        </div>

        <div className="b">
          <input type="search"/>
        </div>
      </div>
    </>
  );
};

export default Home;
