import React from 'react'
import {Carousel, Card} from 'antd'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import './style.css'

const imgs = [
  'http://47.99.130.140/imgs/wallhaven-p8r1e9.jpg',
  'http://47.99.130.140/imgs/wallhaven-e7zyy8.jpg',
  'http://47.99.130.140/imgs/wallhaven-6k9e7q.jpg',
  'http://47.99.130.140/imgs/photo.jpg',
]

@withRouter @inject('appStore') @observer
class Home extends React.Component {
  render() {
    return (

      <div style={styles.bg} className='home'>
        <Carousel arrows effect='fade' className='size'>

        <div>
          <div style={styles.backgroundBox}>
          <video autoplay="autoplay" loop="loop" preload="" muted="muted" src="http://45.76.99.155/static/welcome.mp4" class="video1 video">
            {/* <h3 style={styles.contentStyle}>1</h3> */}
          </video>
          </div>
          <div style = {styles.testStyle}>
            <h3>{this.props.appStore.loginUser.username}, 欢迎来到卓越人才管理系统！</h3>
          </div>
        </div>
        
        
        </Carousel>
      </div>
    )
  }
}

const styles = {
  testStyle:{
    position: 'absolute',
    textAlign: 'center',
  },
  contentStyle: {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
  },
  backgroundBox: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    // backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    transition:'all .5s'
  },
  bg:{
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'calc(100vh - 64px)'
  }
}

export default Home