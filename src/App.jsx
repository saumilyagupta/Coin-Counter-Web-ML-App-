// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css"; 
import { FaLinkedinIn } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";



function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  

  const [confidence ,setConfidence ] = useState(90)
  const [Number_Ditection , SetDetection] = useState(3)
  const [totalAmount , setTotalAmount] = useState(0)

  const handleMaxCoin = (e) =>
    {
      SetDetection(e.target.value)
      // console.log("Number change " + Number_Ditection)
    }
   

  const handleConfidance = (e) =>
    {
      setConfidence(e.target.value )
      // console.log("change kiya hia " +confidence)
    } 
  

  const LableMap ={
    1: {name:'1' ,color:'red'},
    2: {name:'2' ,color:'yellow'},
    3: {name:'5' ,color:'green'},
    4: {name:'10' ,color:'pink'},
  }
  
  // console.log(Number_Ditection)
  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    const net = await tf.loadGraphModel('./tensorflow-model/model.json')
    // Loop and detect hands
    // return net 
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net ) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)

      // console.log(obj)
      
      const boxes = await obj[5].array()
      const classes = await obj[7].array()
      const scores = await obj[3].array()
      // console.log(obj)

      // Draw mesh
      const ctx = canvasRef.current.getContext('2d');

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      // drawRect(boxes, classes, scores, 0.1, videoWidth, videoHeight, ctx); 
      // setTotalAmount = 

      console.log(confidence)
      console.log(Number_Ditection)
      requestAnimationFrame(()=>{  drawRect(boxes[0], classes[0], scores[0], confidence/100,Number_Ditection, videoWidth, videoHeight, ctx)}); 

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

      
    

    }
  };

  
  const drawRect =(boxes , classes ,scores, threshold ,max_dit , imgWidth , imgHeight , ctx) => {

  let money =0
  // console.log(threshold)
      for(let i=0 ; i<=Object.keys(boxes[0]).length ; i++){
              if(boxes[i] && classes[i] && scores[i]>threshold && i<max_dit){
                    const [y,x,height, width] = boxes[i]
                    const text = classes[i]
                 
  

                    let c_money = parseInt(LableMap[text]['name']);                    
                    money = money + c_money 
  
                    ctx.strokeStyle =  LableMap[text]['color']
                    ctx.linewidth = 40 
                    ctx.fillStyle = 'white'
                    ctx.font = '30px Arial'
  
                    ctx.beginPath()
                    ctx.fillText(LableMap[text]['name'] + ' - '+  Math.round(scores[i]*100), x*imgWidth , y*imgHeight)
                    ctx.rect(x*imgWidth , y*imgHeight, width*imgWidth/2,height*imgHeight/2);
                    ctx.stroke()
     
              }
          }
    // console.log(money)
    setTotalAmount(money)

  }

  useEffect(()=>{runCoco( )},[confidence , Number_Ditection]);
  
 
 


  return (  
  <div className="flex flex-col min-h-screen  bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" >
  {/* <div className="absolute top-0 z-[-2] h-screen w-screen"></div> */}
      <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <span href="#" className="text-xl font-bold" prefetch={false}>
          CoinCounter
        </span>
        <nav>
          <ul className="flex space-x-4">
            <li>

            <a href="https://www.linkedin.com/in/saumilyagupta/" ><FaLinkedinIn /></a> 
            </li>
            <li>
              <span href="#" className="hover:underline" prefetch={false}>
             <a href="https://github.com/saumilyagupta" > <FaGithub /> </a> 
              </span>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 py-10 px-3">
        <div className="max-w-4xl mx-auto grid grid-cols-1  md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-auto h-1/2  bg-gray-200  rounded-lg overflow-hidden" style={{height:400}}>
            
                      <Webcam
                    ref={webcamRef}
                    muted={true} 
                    style={{
                     
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      zindex: 9,
                      width: 640,
                      height: 480,
                    }}
                  />
                    <canvas
                  ref={canvasRef}
                  style={{
                  
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 8,
                    width: 640,
                    height: 480,
                  }}
                />
            
            </div>
          </div>
          <div className="space-y-10 text-white">
            <div>
              <label htmlFor="brightness" className="block font-medium mb-2">
                confidence
              </label>
              <input type="range" id="brightness" min="0" max="100" defaultValue="50"  
              onChange={handleConfidance} value={confidence}
              
              className="w-full" />
              {confidence} %
            </div>
            <div>
              <label htmlFor="contrast" className="block font-medium mb-2">
                Max Number Of Coin 
              </label>
              <input type="range" id="contrast" min="0" max="10" value={Number_Ditection} onChange={handleMaxCoin} defaultValue="50" className="w-full" />
              {Number_Ditection}
            </div>
            <div>
              <p className="font-medium mb-2">Output:</p>
              <p>Total Amount {totalAmount} INR</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-4 px-6 flex justify-start items-center">
        <p className="container">Developed with ❤️ by Saumilya</p>
        <nav>
          🐿️ 
        </nav>
      </footer>

  </div>
  );
}

export default App;