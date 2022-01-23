import React from 'react';
import './App.scss'

interface IProps {
}

interface IState {
  imagesList: string[];
  mode: string;
  size: number;
}

export default class App extends React.Component<IProps, IState>{
  constructor(props: IProps) {
    super(props);
    this.state = {
      imagesList: [],
      mode: '9',
      modeValue: '',
      size: 50,
      scrollTop: 0,
      windowHeight: 0,
      scrollHeight: 0,
    } as IState;
  }
  componentDidMount() {
    this.setState({
      mode: this.getUrlParam('mode')
    })
    this.getImages(this.state.size);
    this.onScroll(this.state.size);
    this.keydown();
  }
  //Drop the screen to add a picture
  onScroll = async (size: number) => {
    window.onscroll = async () => {
      //The variable scrolltop is scrolling the scroll bar, distance from the top
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //Variables WindowHeight are the height of visible area
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //Variable scrollHeight is the total height of the scroll bar
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      //Conditions of scroll bars to the bottom
      if ((scrollTop + windowHeight + 50) >= scrollHeight) {
        // console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        await this.getImages(size);
      }
    }
  }
  //Get a picture
  async getImages(size = 1) {
    for (let i = 0; i < size; i++) {
      let res = await fetch(`https://3650000.xyz/api/?type=json&mode=${this.state.mode}&`);
      let data = await res.json();
      this.setState((state) => ({
        imagesList: [...state.imagesList, data.url as never]
      }))
    }
  }
  //Image click to enlarge
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

  // 获取地址栏参数
  getUrlParam(name: string) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg) as any;
    if (r != null) return unescape(r[2]); return '9';
  }

  keydown() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.keyCode === 73) {
        let person = prompt('Please enter the mode:', '66');
        if (person) {
          console.log(person);
          this.setState({
            mode: person
          })
          console.info(this.state.mode);
        }
      }
    })
  }

  render() {
    return (
      <div>
        <div className="waterfall">
          {this.state.imagesList.map((item: string | undefined, index: React.Key | null | undefined) => {
            return (
              <div key={index} className="image-box">
                <img src={item} alt="" onClick={this.clickEnlarge} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
