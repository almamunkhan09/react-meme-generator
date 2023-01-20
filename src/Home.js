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
          requiredData.push({ value: obj.blank, label: obj.name }),
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

  // We want to track the texts on input change
  const trackBottomText = (event) => {
    const rawBottomText = event.target.value
      .replaceAll('#', '~h')
      .replaceAll('?', '~q')
      .replaceAll('/', '~s');

    setBottomText(rawBottomText);
  };
  const trackTopText = (event) => {
    const rawTopText = event.target.value
      .replaceAll('#', '~h')
      .replaceAll('?', '~q')
      .replaceAll('/', '~s');
    setTopText(rawTopText);
  };

  // Define the slected template to have info about background selection by the user;

  const [selectedTemplate, setSelectedTemplate] = useState(
    'https://api.memegen.link/images/buzz/memes/memes_everywhere.gif',
  );

  // Then need to track the slected background
  const trackSelection = (event) => {
    setSelectedTemplate(event.target.value);
  };

  // Image url to display the preview of the image and further download
  const [imageURL, setImageURL] = useState(
    'https://api.memegen.link/images/buzz/memes/memes_everywhere.gif',
  );

  // The function to generate the preview set the image url based on the user's selected background

  const generate = () => {
    const blankURL = selectedTemplate.replace(/.(?:jpg|gif|png)$/, ''); // Split the url without file type
    const fileType = selectedTemplate.replace(blankURL, ''); // Find the file type
    const newURl = `${blankURL}/${topText ? topText : '_'}/${
      // Generate a new url having top text bottom text
      bottomText ? bottomText : '_'
    }/${fileType}`;
    console.log(topText, bottomText);
    setImageURL(newURl); // Set image url to show in the preview
  };

  // Handle submit form
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const dowloadhandler = () => {
    const fileName = imageURL
      .replace('https://api.memegen.link/images/', '') // We need to find the image name from the url
      .replace(/\//gm, '')
      .replaceAll('~h', '#')
      .replaceAll('~s', '/')
      .replaceAll('/[_]/g', ' /[ ]/g');
    console.log(fileName);
    saveAs(imageURL, fileName);
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
          <div className="input-flex">
            <label htmlFor="Top text">
              {' '}
              Top text <input className="input-field" onChange={trackTopText} />
            </label>
          </div>
          {/* input for bottom text  */}
          <div className="input-flex">
            <label htmlFor="Bottom text">
              {' '}
              Bottom text{' '}
              <input className="input-field" onChange={trackBottomText} />
            </label>
          </div>
          {/* Select background  */}
          <div className="input-flex">
            <label htmlFor="Templates">
              {' '}
              Templates
              {apiData.length ? (
                <select
                  name="cars"
                  id="cars"
                  className="selectItem"
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
            </label>
            {/* loopinf through api data  */}
          </div>
          <img data-test-id="meme-image" src={imageURL} alt="Italian Trulli" />
          <div className="action">
            {/* generate button  */}
            <button
              onClick={generate}
              className="action-button"
              data-test-id="generate-meme"
            >
              Generate
            </button>
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
