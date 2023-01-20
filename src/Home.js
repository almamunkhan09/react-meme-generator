import './Home.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MyComponent } from './CustomSelect';

// const templatesURL = 'https://api.memegen.link/templates/';

export default function Home() {
  const [bottomText, setBottomText] = useState('');
  const [topText, setTopText] = useState('');
  const [apiData, setApiData] = useState([]);
  // const [slectedTemplate, setSelectedTemplate] = useState(
  //   'https://api.memegen.link/images/buzz/memes/memes_everywhere.gif',
  // );
  const [imageURL, setImageURL] = useState(
    'https://api.memegen.link/images/buzz/memes/memes_everywhere.gif',
  );

  const trackBottomText = (event) => {
    setBottomText(event.target.value);
  };
  const trackTopText = (event) => {
    setTopText(event.target.value);
  };
  const trackSelection = (event) => {
    const blankURL = event.target.value.replace(/.(?:jpg|gif|png)$/, '');
    const fileType = event.target.value.replace(blankURL, '');
    const newURl = `${blankURL}/${topText ? topText : '_'}/${
      bottomText ? bottomText : '_'
    }/${fileType}`;
    console.log(newURl);
    console.log(blankURL);
    // if (top) setImageURL(event.target.value);

    // + (topText ? topText : '_' ) + '/' + (bottomText ? bottomText: '_'+);
    setImageURL(newURl);
  };

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

  return (
    <div>
      {console.log(apiData)}
      <div className="card">
        <div className="card-image">
          <h2 className="card-heading">
            Meme Genrator
            <small>Create your custom meme</small>
          </h2>
        </div>
        <form className="card-form">
          <div className="input-flex">
            <label htmlFor="Top text"> Top text</label>

            <input className="input-field" onChange={trackTopText} />
          </div>
          <div className="input-flex">
            <label htmlFor="Bottom text"> Bottom text</label>
            <input className="input-field" onChange={trackBottomText} />
          </div>
          <div className="input-flex">
            <label htmlFor="Templates"> Templates</label>
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
          </div>
          <img data-test-id="meme-image" src={imageURL} alt="Italian Trulli" />
          <div className="action">
            <button readOnly className="action-button">
              Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
