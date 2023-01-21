// Import Packages
import './Home.scss'; // Import css file
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';

export default function Home() {
  // First load the Api Data when the DOM is loaded for first time
  const [apiData, setApiData] = useState([]); // Define the apidata variable to see if the data is loaded
  // If Api data is loaded then we will show the the slect options for template/Background selection

  useEffect(() => {
    axios
      .get('https://api.memegen.link/templates/')
      .then((res) => {
        const { data } = res;

        const requiredData = [];
        data.map((obj) =>
          requiredData.push({ value: obj.id, label: obj.name }),
        );
        return requiredData;
      })
      .then((response) => setApiData(response))
      .catch((err) => console.log(err));
  }, []);

  // We need to track the top tecxt and bottom text given by the user.
  // Define top text and bottom text
  const [bottomText, setBottomText] = useState('');
  const [topText, setTopText] = useState('');

  // Define the slected template to have info about background selection by the user;
  const [imageId, setImageId] = useState('awesome');
  // Image url to display the preview of the image and further download
  const [imageUrl, setImageUrl] = useState(
    'https://api.memegen.link/images/awesome.png',
  );

  const replaceSpecialCharecters = (inputArray) => {
    return inputArray
      .replaceAll('#', '~h')
      .replaceAll('?', '~q')
      .replaceAll('/', '~s');
  };

  const urlGenerator = (currentTopText, currentBottomText, currentImageId) => {
    const newCurrentTopText = replaceSpecialCharecters(currentTopText);
    const newCurrentBottomText = replaceSpecialCharecters(currentBottomText);
    const newUrl = `https://api.memegen.link/images/${currentImageId}/${
      currentTopText ? newCurrentTopText : '_'
    }/${currentBottomText ? newCurrentBottomText : '_'}.png`;
    const newUrlArray = newUrl.split(' ');
    const finalUrl = newUrlArray.join('_');
    return finalUrl;
  };

  // Handle submit form in order to prevent reload page
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const trackTopText = (event) => {
    setTopText(event.target.value);
    const newImageUrl = urlGenerator(event.target.value, bottomText, imageId);
    setImageUrl(newImageUrl);
  };

  // We want to track the texts on input change
  const trackBottomText = (event) => {
    setBottomText(event.target.value);
    const newImageUrl = urlGenerator(topText, event.target.value, imageId);
    setImageUrl(newImageUrl);
  };

  // Then need to track the slected background
  const trackSelection = (event) => {
    setImageId(event.target.value);
    const newImageUrl = urlGenerator(topText, bottomText, event.target.value);
    setImageUrl(newImageUrl);
  };

  // The function to generate the preview set the image url based on the user's selected background

  const dowloadhandler = () => {
    const fileName = imageUrl
      .replace('https://api.memegen.link/images/', '') // We need to find the image name from the url
      .replace(/\//gm, '')
      .replaceAll('~h', '#')
      .replaceAll('~s', '/')
      .replaceAll('/[_]/g', ' /[ ]/g');
    saveAs(imageUrl, fileName);
  };

  return (
    <div>
      <div className="card">
        <div className="card-image">
          <h2 className="card-heading">
            Meme Genrator
            <small>Create your custom meme</small>
          </h2>
        </div>
        <form className="card-form" onSubmit={handleSubmit}>
          {/* Input for top text */}
          <label htmlFor="top-text">Top text</label>
          <input
            className="input-field"
            id="top-text"
            onChange={trackTopText}
          />

          {/* input for bottom text  */}

          <label htmlFor="bottom-text">Bottom text</label>
          <input
            className="input-field"
            id="bottom-text"
            onChange={trackBottomText}
          />
          <br />
          {/* Select background  */}
          <label htmlFor="memetemplate">Meme template</label>
          {apiData.length ? (
            <select
              className="selectItem"
              id="memetemplate"
              onChange={trackSelection}
            >
              {' '}
              <option>Select Templates</option>
              {apiData.map((obj) => (
                <option key={obj.value} value={obj.value}>
                  {obj.label}
                </option>
              ))}
            </select>
          ) : null}
          {console.log(imageUrl)}
          <img data-test-id="meme-image" src={imageUrl} alt="Italian Trulli" />
          <div className="action">
            {/* generate button  */}
            {/* <button
              onClick={() => {}}
              className="action-button"
              data-test-id="generate-meme"
            >
              Generate
            </button> */}
            {/* Download Button  */}
            <button onClick={dowloadhandler} className="action-button">
              Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
