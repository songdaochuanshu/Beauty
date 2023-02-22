import React from 'react';
import './App.scss'

interface IImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface IState {
  imagesList: IImage[];
  loadedIds: Set<string>;
}

export default class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      imagesList: [],
      loadedIds: new Set(),
    };
  }

  componentDidMount() {
    this.getImages(16, 1);
    window.onscroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500) {
        const page = Math.floor(this.state.imagesList.length / 16) + 1;
        this.getImages(16, page);
      }
    };
  }

  async getImages(size = 16, page = 1) {
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${size}`);
    const data = await response.json();
    this.setState((prevState) => ({
      imagesList: [...prevState.imagesList, ...data.filter((image: { id: string; }) => !prevState.loadedIds.has(image.id))],
      loadedIds: new Set([...prevState.loadedIds, ...data.map((image: { id: any; }) => image.id)]),
    }));
  }

  clickEnlarge(e: any) {
    let div = document.createElement('div');
    let img = document.createElement('img');
    div.style.position = `fixed`;
    div.style.top = `0`;
    div.style.left = `0`;
    div.style.width = `100%`;
    div.style.height = `100vh`;
    div.style.background = `rgba(0,0,0,0.9)`;
    div.style.zIndex = `999`;
    div.style.display = `flex`;
    div.style.justifyContent = `center`;
    div.style.alignItems = `center`;
    div.style.cursor = `zoom-out`;
    div.style.transition = `all 0.5s`;
    div.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      fill: 'forwards',
    });
    img.src = e.target.src;
    div.appendChild(img);
    img.style.maxWidth = `100%`;
    img.style.maxHeight = `95%`;
    img.style.transition = `all 0.4s`;
    document.body.appendChild(div);

    //No click bubbling
    div.onclick = (e) => {
      img.style.opacity = `0`;
      setTimeout(() => {
        document.body.removeChild(div);
      }, (380))
    }

    //esc to close
    document.onkeydown = (e) => {
      if (e.keyCode === 27) {
        img.style.opacity = `0`;
        setTimeout(() => {
          document.body.removeChild(div);
        }, (380))
      }
    }
  }

  render() {
    const { imagesList } = this.state;

    return (
      <div>
        <div className="waterfall">
          {imagesList.map((image) => (
            <div className="image-box" key={image.id}>
              <img
                onClick={this.clickEnlarge}
                src={image.download_url}
                width={image.width / 10}
                height={image.height / 10}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
