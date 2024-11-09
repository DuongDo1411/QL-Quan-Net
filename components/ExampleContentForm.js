import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import { useRouter } from "next/router";


export default function ExampleContentForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [imgExample, setImgExample] = useState("");
  const [description, setDescription] = useState("");
  const [exampleId, setExampleId] = useState("");
  const [examples, setExamples] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/exampleDetails');
      console.log('Fetched examples:', response.data); // Debug: Log fetched examples
      setExamples(response.data);
    } catch (error) {
      console.error('Error fetching examples:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveExampleContent = async (ev) => {
    ev.preventDefault();
    const data = {
      Name: name,
      Content: content,
      imgExample: images.length > 0 ? images[0] : '', // Use the first uploaded image URL as imgExample
      Description: description,
      ExampleId: exampleId
    };
    console.log('Save Example Content Data:', data); // Debug: Log data before saving
    try {
      await axios.post("/api/exampleContents", data);
      // Handle success
    } catch (error) {
      console.error("Error saving example content:", error);
      // Handle error
    }
    setGoToProducts(true);

  };

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      try {
        const res = await axios.post('/api/upload', data);
        const uploadedImageUrls = res.data.links;
        setImages(uploadedImageUrls); // Set the images state with the uploaded image URLs
        setSelectedImages(oldImages => [...oldImages, ...uploadedImageUrls]);
      } catch (error) {
        console.error("Error uploading images:", error);
        // Handle error
      }
      setIsUploading(false);
    }
  }
  
  const updateImagesOrder = useCallback((images) => {
    setSelectedImages(images);
  }, []);

  useEffect(() => {
    if (goToProducts) {
      router.push("/exampleContents");
    }
  }, [goToProducts, router]);


  return (
    <form onSubmit={saveExampleContent}>
      <label>Name</label>
      <input
        type="text"
        placeholder="Example Name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <label>Content</label>
      <textarea
        placeholder="Example Content"
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Example ID</label>
      <select
      value={exampleId}
      onChange={(ev) => setExampleId(ev.target.value)}
    >
      <option value="">Select Example</option>
      {isLoading ? (
        <option>Loading...</option>
      ) : (
        examples.map(example => {
          return (
            <option key={example.Id} value={example.ExampleId}>{example.Name}</option>
          );
        })
      )}
    </select>
      <label>Images</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={selectedImages}
          setList={updateImagesOrder}
          className="mb-2 flex flex-wrap gap-1"
        >
          {selectedImages.map((image, index) => (
            <div key={index} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
              <img src={image} alt={`Selected Image ${index}`} className="rounded-lg" style={{ maxWidth: "100%", maxHeight: "100%" }} />
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            Add image
          </div>
          <input type="file" onChange={uploadImages} className="hidden" multiple />
        </label>
      </div>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
