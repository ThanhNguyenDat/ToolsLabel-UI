import classNames from 'classnames/bind';
import styles from './ImageObjectDetection.scss';

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const cx = classNames.bind(styles);

function ImageObjectDetection() {
  // const [url, setUrl] = useState();
  const [image, setImage] = useState();
  const [result, setResult] = useState([]);
  const [imgW, setImgW] = useState(1000);
  const [imgH, setImgH] = useState(1000);
  
  const canvas_ref = useRef();

  const img = new Image();

  useEffect(() => {
    call_api(image);
    
    img.addEventListener("load", loadImage)

    // Cleanup event
    return () => {
      img.removeEventListener("load", loadImage);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  useEffect(() => {
    // const c = document.getElementById("canvas-img");
    const c = canvas_ref.current;
    
    c.width = c.clientWidth;
    c.height = c.clientHeight;

    const ctx = c.getContext("2d");
    if (result.length === 0) return
    // Why call 3 times???
    console.log("ctx: ", ctx);

    // load img and drawing box
    const onLoad = () => {
      var scale = Math.min(c.width / imgW, c.height / imgH);
      var x = (c.width / 2) - (imgW / 2) * scale;
      var y = (c.height / 2) - (imgH / 2) * scale;
      ctx.drawImage(img, x, y, imgW * scale, imgH * scale);

      if (result) {
        // // draw box

        // Drawing box
        var boxs = result.data.result
        console.log(boxs);

        // DRAW
        ctx.beginPath();

        // eslint-disable-next-line array-callback-return
        boxs.map(box => {
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 1;
          
          // ctx.rect(x + box.xmin * scale, y + box.ymin * scale, (box.xmax - box.xmin) * scale, (box.ymax - box.ymin) * scale);
          ctx.moveTo(x + box.xmin * scale, y + box.ymin * scale);
          ctx.lineTo(x + box.xmax * scale, y + box.ymin * scale);
          ctx.lineTo(x + box.xmax * scale, y + box.ymax * scale);
          ctx.lineTo(x + box.xmin * scale, y + box.ymax * scale);
          ctx.lineTo(x + box.xmin * scale, y + box.ymin * scale);
        })

        ctx.stroke();
        console.log("DRAWED");
      }
    }

    img.addEventListener("load", onLoad)
    img.src = image.url;
    // // initial and getsize image


    // Cleanup event and fill canvas
    return () => {
      img.removeEventListener("load", onLoad)
      ctx.beginPath();
      ctx.rect(0, 0, c.width, c.height);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, image])


  /* This useEffect's used when remove url after upload new image  */
  // useEffect(() => {
  //   // Cleanup
  //   return () => {
  //     image && URL.revokeObjectURL(image.url);
  //   }
  // }, [image])

  function handleChange(event) {
    const file = event.target.files[0];
    if (file) {
      file.url = URL.createObjectURL(file);
      setImage(file);
    }
  }

  function onPredict(event) {
    console.log("Result onPredict: ", result);
  }

  const call_api = async (image) => {
    // call api
    const formData = new FormData();

    if (image) {
      formData.append(
        'image',
        image,
        image.name
      )

      const url = "http://127.0.0.1:8000/objectdetection";
      const data = await axios.post(url, formData); // using with await
      setResult(data);
      console.log("Called API");
    }
  }

  const loadImage = () => {
    setImgH(img.height);
    setImgW(img.width);
  }

  return (
    <div className="App">
      <input id="imgInp" accept="image/*" type="file" onChange={handleChange} />
      <p />
      <button onClick={onPredict}>Predict Vô Console coi result thôi nhé các anh =]]]!</button>
      <p />
      <div className='image'>
        <canvas
          id="canvas-img"
          style={{ width: "100vw", height: "80vh" }}
          ref = {canvas_ref}
        />
      </div>

    </div>
  );
}

export default ImageObjectDetection;
