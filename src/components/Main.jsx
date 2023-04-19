import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "two-up-element";
import { Cloudinary } from "@cloudinary/url-gen";
import { backgroundRemoval } from "@cloudinary/url-gen/actions/effect";

//Icons import

import cloudinaryImage from "../icons/cloudinary.png";
import githubImage from "../icons/github.png";
import linkedinImage from "../icons/linkedin.png";

//End of Icons import

export default function Main() {
  
  //UseState declarations

  const [tries, setTries] = useState(0);

  const [processingImage, setProcessingImage] = useState(false);

  const [buttonClicked, setButtonClicked] = useState(false);

  //End of UseState declarations

  //UseEffect

  useEffect(() => {
    let intervalId = 0;
    if (buttonClicked && processingImage) {
      intervalId = setInterval(() => {
        setTries((prevTries) => prevTries + 1);
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [buttonClicked, processingImage]);

  //End of UseEffect

  //Cloudinary logic to remove background

  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
    },
    url: {
      secure: true,
    },
  });

  const [files, setFiles] = useState([]);

  const [cloudinaryFile, setCloudinaryFile] = useState([]);

  //End of Cloudinary logic to remove background

  //DropZone to upload image to cloudinary

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "images/*",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessingImage(true);
    setButtonClicked(true);
    if (!files?.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("upload_preset", "d1f0jzsc");

    const URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`;
    const data = await fetch(URL, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    const imageWithoutBackground = cloudinary
      .image(data.public_id)
      .effect(backgroundRemoval());
    setCloudinaryFile(imageWithoutBackground.toURL());
  };

  //End of DropZone to upload image to cloudinary

  return (
    <>
      <section className="w-full h-screen flex flex-col justify-around items-center">
        <div className="bg-[#492306] w-fit p-3 rounded-lg">
          <h1 className="text-white font-poppins text-4xl">No Bg App</h1>
        </div>
        <div className="">
          <h3 className="text-center font-poppins text-[#A0734E]">
            Highlight the important, eliminate the unnecessary. <br /> Erase the
            background of your images with us
          </h3>
        </div>
        <div>
          {files.length < 1 ? (
            <div
              className="bg-[#F9EEDA] w-80 h-64 flex flex-col justify-center items-center gap-3 rounded-3xl"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>or drop a file</p>
              ) : (
                <button
                  type="button"
                  class="py-2 px-4  bg-[#FFFEFE] hover:bg-[#492306] hover:text-white focus:ring-indigo-500 focus:ring-offset-indigo-200 text-[#5C340F] w-32 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                >
                  Upload files
                </button>
              )}
              <p className="text-[#A0734E]">or drop a file...</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-5">
              <div className="bg-[#F9EEDA] w-80 h-64 flex flex-col justify-center items-center gap-3 rounded-3xl">
                <two-up>
                  <img
                    src={files[0]?.preview}
                    alt="Foto brindada por el usuario"
                    className="object-contain h-64"
                  />
                  <img
                    onLoad={() => setProcessingImage(false)}
                    onError={() => setProcessingImage(true)}
                    src={`${
                      cloudinaryFile ? cloudinaryFile : false
                    }&t=${tries}`}
                    alt="Loading"
                    className="object-contain h-64"
                  />
                </two-up>
              </div>
              <div className="w-72 flex justify-center items-center">
                {buttonClicked === false ? (
                  <button
                    onClick={handleSubmit}
                    class="py-2 px-4  bg-[#FFFEFE] hover:bg-[#492306] hover:text-white focus:ring-indigo-500 focus:ring-offset-indigo-200 text-[#5C340F] w-32 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Remove Background
                  </button>
                ) : (
                  false
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          {buttonClicked === true ? (
            <a
              download
              href={cloudinaryFile}
              class="py-2 px-4  bg-[#FFFEFE] hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-[#5C340F] w-32 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Download image
            </a>
          ) : (
            false
          )}
        </div>
        <nav className="flex flex-col lg:flex-row w-full justify-center lg:justify-around items-center gap-5 lg:gap-0">
          <div className="bg-[#E05548] w-fit p-3 rounded-lg flex justify-center items-center gap-3">
            <h1 className="text-white font-poppins text-[12px]">
              Made by Juan José Cieri
            </h1>
            <a href="https://github.com/JuanjoCieri">
              <img src={githubImage} alt="githubImage" width="20px" />
            </a>
            <a href="https://www.linkedin.com/in/juan-jose-cieri">
              <img src={linkedinImage} alt="githubImage" width="20px" />
            </a>
          </div>
          <div className="flex justify-center items-center bg-[#E05548] w-fit p-3 rounded-lg">
            <p className="font-poppins text-[12px] text-white">App made with</p>
            <img src={cloudinaryImage} alt="cloudinaryimage" width="100px" />
            <p className="font-poppins text-[12px] text-white">API</p>
          </div>
        </nav>
      </section>
    </>
  );
}
