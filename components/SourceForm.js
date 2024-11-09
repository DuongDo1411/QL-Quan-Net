/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function SourceForm({
  _id,
  NameSource: existingNameSource,
  Description: existingDescription,
  Price: existingPrice,
  imageUrl: existingImageUrl,
  existingImage,
  quantityVideo: existingQuantityVideo,
  TimeVideo: existingTimeVideo,
  paid: existingPaid,
  lessonId: existingLessonId,
  category:assignedCategory,
}) {
  const [NameSource, setNameSource] = useState(existingNameSource || "");
  const [Description, setDescription] = useState(existingDescription || "");
  const [Price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImageUrl ? [existingImageUrl] : []);
  const [selectedImages, setSelectedImages] = useState(existingImage || []);
  const [quantityVideo, setQuantityVideo] = useState(existingQuantityVideo || "");
  const [TimeVideo, setTimeVideo] = useState(existingTimeVideo || "");
  const [paid, setPaid] = useState(existingPaid || false);
  const [lessonIds, setLessonIds] = useState(existingLessonId ? existingLessonId.split(',') : []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories,setCategories] = useState([]);
  const [category,setCategory] = useState(assignedCategory || '');
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  const addLesson = () => {
    const lessonCount = lessonIds.length + 1;
    setLessonIds([...lessonIds, `Lesson ${lessonCount}`]);
  };

  const removeLesson = (index) => {
    const newLessonIds = [...lessonIds];
    newLessonIds.splice(index, 1);
    setLessonIds(newLessonIds);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      NameSource,
      Description,
      Price,
      imageUrl: images.length > 0 ? images[0] : null,
      quantityVideo,
      TimeVideo,
      paid,
      lessonId: lessonIds.join(','),
      category,
    };
    try {
      if (_id) {
        await axios.put('/api/updateSource', { _id, data }); // Update existing source
      } else {
        await axios.post("/api/sources", data); // Create a new source
      }
      setGoToProducts(true);
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error
    }
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      const uploadedImageUrls = res.data.links;
      setImages(uploadedImageUrls); // Set the images state with the uploaded image URLs
      setSelectedImages(oldImages => [...oldImages, ...uploadedImageUrls]);
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (goToProducts) {
      router.push("/sources");
    }
  }, [goToProducts, router]);

  function updateImagesOrder(images) {
    setSelectedImages(images);
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Name</label>
      <input
        type="text"
        placeholder="Source name"
        value={NameSource}
        onChange={(ev) => setNameSource(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={Description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price</label>
      <input
        type="text"
        placeholder="Price"
        value={Price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
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
      </div>      <label>Quantity of Video</label>
      <input
        type="text"
        placeholder="Quantity of video"
        value={quantityVideo}
        onChange={(ev) => setQuantityVideo(ev.target.value)}
      />
      <label>Time of Video</label>
      <input
        type="text"
        placeholder="Time of video"
        value={TimeVideo}
        onChange={(ev) => setTimeVideo(ev.target.value)}
      />
     
      <label>Paid</label>
      <input
        type="checkbox"
        checked={paid}
        onChange={(ev) => setPaid(ev.target.checked)}
      />
      
      <label>Category</label>
      <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 && categories.map(c => (
            <option value={c._Id}>{c.Name}</option>
          ))}
        </select>
      <div>
        <label>Lesson IDs</label>
        {lessonIds.map((lesson, index) => (
          <div key={index} className="flex items-center">
            <input type="text" value={lesson} readOnly />
            <button className="btn-primary" type="button" onClick={() => removeLesson(index)}>Delete</button>
          </div>
        ))}
        <button type="button" onClick={addLesson}>Add Lesson</button>
      </div>
      <button
        type="submit"
        className="btn-primary"
      >
        Save
      </button>
    </form>
  );
}
