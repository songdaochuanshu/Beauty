/*
 * @Descripttion: 
 * @version: 
 * @Author: MiKin
 * @Date: 2022-01-21 16:30:26
 * @LastEditors: MiKin
 * @LastEditTime: 2022-01-21 16:44:32
 * @FilePath: \Beauty\main.js
 */
import './style.css'
import { createApp } from 'petite-vue'

createApp({

  //data
  imagesList: [],
  mode: 9,

  async mounted() {
    this.keydown();
    await this.getImages(6);
    document.querySelector('#loading').remove()
    await this.onScroll();
  },

  keydown() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.keyCode === 73) {
        let  person = prompt('Please enter the mode:', '66');
        if (person) {
          this.mode = person;
        }
      }
    })
  },

  //Drop the screen to add a picture
  async onScroll() {
    window.onscroll = async () => {
      //The variable scrolltop is scrolling the scroll bar, distance from the top
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //Variables WindowHeight are the height of visible area
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //Variable scrollHeight is the total height of the scroll bar
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      //Conditions of scroll bars to the bottom
      if ((scrollTop + windowHeight + 50) >= scrollHeight) {
        console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        await this.getImages();
      }
    }
  },

  //Get a picture
  async getImages(size = 3) {
    for (let i = 0; i < size; i++) {
      let res = await fetch(`https://3650000.xyz/api/?type=json&mode=${this.mode}&`);
      let data = await res.json();
      this.imagesList.push(data.url);
    }
  },

  //Image click to enlarge
  clickEnlarge(e) {
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
    img.src = e.path[0].currentSrc;
    div.appendChild(img);
    img.style.maxWidth = `100%`;
    img.style.maxHeight = `95%`;
    img.style.transition = `all 0.4s`;
    document.body.appendChild(div);

    //No click bubbling
    div.onclick = (e) => {
      img.style.transform = `scale(0.0)`
      setTimeout(() => {
        document.body.removeChild(div);
      }, (380))

    }
  },

}).mount()