import React, { useRef, useState, useEffect } from 'react';

function AudioVisualizer(props) {
    const [audioElement, setAudioElement] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const canvasAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const frequencyRef = useRef(null);
    const backgroundRef = useRef(null);
    const scrubBarRef = useRef(null);
    const [play, setPlay] = useState(false);

    useEffect(() => {
        if (audioElement) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(audioElement);
            const analyser = audioCtx.createAnalyser();
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            const bufferLength = analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);

            function updateScrubBar() {
                if(audioElement && scrubBarRef.current) {
                    let currentTime = audioElement.currentTime;
                    let duration = audioElement.duration;
                    let scrubBarValue = (currentTime/duration) * 100;
                    scrubBarRef.current.value = scrubBarValue;
                }
            }

            audioElement.addEventListener("timeupdate", updateScrubBar);
            audioElement.src = (fileInputRef.current && fileInputRef.current.files[0])? URL.createObjectURL(fileInputRef.current.files[0]): process.env.PUBLIC_URL + '/music/song.mp3';
            audioElement.addEventListener("loadeddata", () => {
                setLoaded(true);
            });
            audioElement.addEventListener("ended", () => {
                setPlay(false);
            });

            frequencyRef.current.willReadFrequently = true;
            backgroundRef.current.willReadFrequently = true;
            const frequencyCtx = frequencyRef.current.getContext("2d");
            const smudgeCtx = backgroundRef.current.getContext("2d");
            backgroundRef.current.style.width ='100%';
            backgroundRef.current.style.height='100%';
            frequencyRef.current.style.width ='100%';
            frequencyRef.current.style.height='100%';
            backgroundRef.current.width  = canvasAreaRef.current.offsetWidth;
            backgroundRef.current.height = canvasAreaRef.current.offsetHeight;
            frequencyRef.current.width  = canvasAreaRef.current.offsetWidth;
            frequencyRef.current.height = canvasAreaRef.current.offsetHeight;

            canvasAreaRef.current.addEventListener("resize", () => {
                backgroundRef.current.width  = canvasAreaRef.current.offsetWidth;
                backgroundRef.current.height = canvasAreaRef.current.offsetHeight;
                frequencyRef.current.width  = canvasAreaRef.current.offsetWidth;
                frequencyRef.current.height = canvasAreaRef.current.offsetHeight;
            });

            let ultimatePeak = 1;
            let rotationAngle = 0;
            let rotateSmudge = false;
            let smudgeVelocity = 0;
            // Draw the frequency spectrum visualization
            function drawVisualization() {
                requestAnimationFrame(drawVisualization);
                analyser.getByteFrequencyData(dataArray);
                
                // draw current frame to main canvas
                frequencyCtx.clearRect(0, 0, frequencyCtx.canvas.width, frequencyCtx.canvas.height);
        
                let avgAmplitude = 0;
                let highFreqAvgAmplitude = 0;
                let midFreqAvgAmplitude = 0;
                let lowFreqAvgAmplitude = 0;
                let lowFreqPeakAmplitude = 0;
                if (dataArray && dataArray.length > 0) {
                    let gradient = frequencyCtx.createLinearGradient(0, 0, frequencyCtx.canvas.width, 0);
                    let highFrequencyColor = getHighFrequencyColor(dataArray);
                    gradient.addColorStop(0, highFrequencyColor);
                    gradient.addColorStop(0.5, getLowFrequencyColor(dataArray));
                    gradient.addColorStop(1, highFrequencyColor);
                    frequencyCtx.fillStyle = gradient;
                    let verticalCenter = frequencyCtx.canvas.height / 2;
                    let zeroAdjust = 0;
                    for (let i = dataArray.length - 1; i >= 0; i--) {
                        if (dataArray[i] - 20 > 0) break;
                        zeroAdjust++;
                    }
                    let barWidth = ((frequencyCtx.canvas.width / dataArray.length)) / 2;
                    let x = 0;
                    let x2 = frequencyCtx.canvas.width;
                    for (let i = 0; i < dataArray.length - zeroAdjust; i++) {
                        drawVisualizationBar(i, barWidth, x, verticalCenter);
                        drawVisualizationBar(i, barWidth, x2, verticalCenter);
                        x += (frequencyCtx.canvas.width / (dataArray.length - zeroAdjust)) / 2;
                        x2 -= (frequencyCtx.canvas.width / (dataArray.length - zeroAdjust)) / 2;
                    }
                    avgAmplitude = getAverageAmplitude(dataArray, 0, dataArray.length);
                    highFreqAvgAmplitude = getAverageAmplitude(dataArray, 12 * dataArray.length / 16, dataArray.length);
                    midFreqAvgAmplitude = getAverageAmplitude(dataArray, dataArray.length / 16, 3 * dataArray.length / 16);
                    lowFreqAvgAmplitude = getAverageAmplitude(dataArray, 0, dataArray.length / 16);
                    lowFreqPeakAmplitude = getPeakAmplitude(dataArray, 0, dataArray.length / 16);
                    frequencyCtx.globalAlpha = (Math.abs(0.2 - (avgAmplitude / 200)) + 0.1) / 2;
                }

                //smudge effect
                rotateSmudge = (rotateSmudge && !(lowFreqPeakAmplitude > ultimatePeak * 1.01) && midFreqAvgAmplitude + highFreqAvgAmplitude > avgAmplitude * 1.8) || midFreqAvgAmplitude + highFreqAvgAmplitude > avgAmplitude * 3.2;
                if (rotateSmudge) {
                    smudgeCtx.drawImage(frequencyCtx.canvas, 0, 0);
                    rotationAngle = (rotationAngle + 1) % 360;
                    smudgeVelocity = (lowFreqAvgAmplitude) / 5 * (midFreqAvgAmplitude < highFreqAvgAmplitude * 2)? -1: 1;
                    // Save the current canvas state
                    smudgeCtx.save();
                    // Rotate the canvas
                    smudgeCtx.translate(smudgeCtx.canvas.width / 2, smudgeCtx.canvas.height / 2);
                    smudgeCtx.rotate(Math.PI / 180 * rotationAngle * smudgeVelocity);
                    smudgeCtx.translate(-smudgeCtx.canvas.width / 2, -smudgeCtx.canvas.height / 2);
                    // Draw the smudged image on the canvas
                    smudgeCtx.drawImage(smudgeCtx.canvas, 0, 0);
                    // Restore the canvas state
                    smudgeCtx.restore();
                    smudgeCtx.globalAlpha = Math.abs(0.04 - (avgAmplitude / 4000));
                } else {
                    rotationAngle = 0;
                    var imageDataTop = smudgeCtx.getImageData(0, 0, smudgeCtx.canvas.width, smudgeCtx.canvas.height / 2);
                    var imageDataBottom = smudgeCtx.getImageData(0, smudgeCtx.canvas.height / 2, smudgeCtx.canvas.width, smudgeCtx.canvas.height);
                    smudgeCtx.clearRect(0, 0, smudgeCtx.canvas.width, smudgeCtx.canvas.height);
                    smudgeCtx.globalAlpha = 0.5 - (avgAmplitude / 100);
                    smudgeVelocity = (avgAmplitude < 10)? avgAmplitude * 2: ((lowFreqPeakAmplitude >= ultimatePeak && lowFreqAvgAmplitude * 0.5 > midFreqAvgAmplitude + highFreqAvgAmplitude)? -1: 1) * avgAmplitude / 4;
                    smudgeCtx.putImageData(imageDataTop, 0, -smudgeVelocity);
                    smudgeCtx.putImageData(imageDataBottom, 0, (smudgeCtx.canvas.height / 2) + smudgeVelocity);
                    smudgeCtx.drawImage(frequencyCtx.canvas, 0, 0);
                }
            }
        
            function getAverageAmplitude(data, startIndex, endIndex) {
                startIndex = Math.trunc(startIndex);
                endIndex = Math.min(Math.trunc(endIndex), data.length);
                let sum = 0;
                for (let i = startIndex; i < endIndex; i++) {
                    sum += data[i];
                }
                return sum / (endIndex - startIndex - 1);
            }
        
            function getPeakAmplitude(data, startIndex, endIndex) {
                startIndex = Math.trunc(startIndex);
                endIndex = Math.min(Math.trunc(endIndex), data.length);
                let peak = 0;
                for (let i = startIndex; i < endIndex; i++) {
                    peak = Math.max(peak, data[i]);
                }
                return peak;
            }
        
            function drawVisualizationBar(index, barWidth, x, verticalCenter) {
                if (dataArray[index] > ultimatePeak) {
                    ultimatePeak = dataArray[index];
                }
                //take the square of the data like this will amplify peaks
                const adjustedData = 8 * dataArray[index] * Math.pow(dataArray[index] / ultimatePeak, 1.5 * (1 - (index / dataArray.length))) * ((index + (dataArray.length / 2)) / dataArray.length);
                let barHeight = adjustedData;
                let offsetX = (Math.random() - 0.5) * adjustedData / 32;
                let offsetY = (Math.random() - 0.5) * adjustedData / 32;
                let offsetWidth = (Math.random() - 0.5) * adjustedData / 32;
                frequencyCtx.fillRect(x + offsetX, verticalCenter - (barHeight / 4) + offsetY, barWidth + offsetWidth, barHeight / 2);
            }
        
            let lowFreqShiftingColorNumber = 0;
            function getLowFrequencyColor(dataArray) {
                let lowFrequencySum = 0;
                let lowFrequencyMax = 0;
                for (let i = 0; i < dataArray.length / 2; i++) {
                    lowFrequencySum += dataArray[i];
                    if (dataArray[i] > lowFrequencyMax) {
                        lowFrequencyMax = dataArray[i];
                    }
                }
                let lowFrequencyAverage = lowFrequencySum / (dataArray.length / 2);
                if (lowFrequencyMax > lowFrequencyAverage * 10 || lowFrequencyAverage > ultimatePeak / 2) {
                    lowFreqShiftingColorNumber = (lowFreqShiftingColorNumber + (lowFrequencyMax / (lowFrequencyAverage * 20)) + (lowFrequencyAverage / ultimatePeak)) % 255;
                }
                return `hsl(${map(lowFrequencyAverage, lowFreqShiftingColorNumber, 255, lowFreqShiftingColorNumber / 4, 360)}, 100%, 50%,` + (lowFrequencySum / (lowFrequencyMax + 0.1)) + `)`;
            }
        
            let highFreqShiftingColorNumber = 0;
            function getHighFrequencyColor(dataArray) {
                let highFrequencySum = 0;
                let highFrequencyMax = 0;
                for (let i = dataArray.length / 2; i < dataArray.length; i++) {
                    highFrequencySum += dataArray[i];
                    if (dataArray[i] > highFrequencyMax) {
                        highFrequencyMax = dataArray[i];
                    }
                }
                let highFrequencyAverage = highFrequencySum / (dataArray.length/ 2);
                if (highFrequencyMax > highFrequencyAverage * 200 || highFrequencyAverage > ultimatePeak / 2) {
                    highFreqShiftingColorNumber = (highFreqShiftingColorNumber + (highFrequencyMax / (highFrequencyAverage * 200)) + (highFrequencyAverage / ultimatePeak)) % 255;
                }
                return `hsl(${map(highFrequencyAverage, highFreqShiftingColorNumber, 255, highFrequencyAverage / 4, 360)}, 100%, 50%,` + (highFrequencySum / (highFrequencyMax + 0.1)) + `)`;
            }
        
            function map(value, start1, stop1, start2, stop2) {
                return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
            }

            drawVisualization();
        }
    }, [audioElement]);

    // Initialize audio context and elements when the file input changes
    function loadAudio() {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        setAudioElement(new Audio());
    }

    //TODO: remove the following line when the scrub bar is set to be active
    // eslint-disable-next-line
    function updatePlayback() {
        if(audioElement && scrubBarRef.current) {
            let scrubBarValue = scrubBarRef.current.value;
            let currentTime = (scrubBarValue / 100) * audioElement.duration;
            audioElement.currentTime = currentTime;
        }
    }

    function togglePlay() {
        if (audioElement) {
            if (audioElement.paused) {
                audioElement.play();
                setPlay(true);
            } else {
                audioElement.pause();
                setPlay(false);
            }
        }
    }

    if (!audioElement) {
        loadAudio();
    }

    return (
        <div style={props.style} className='canvas-area no-select' ref={canvasAreaRef} onClick={togglePlay}>
            <br />
            <br />
            {loaded?
            <div className="control-panel">
                {play?
                <img alt={""} src={process.env.PUBLIC_URL + '/images/pause-button.png'} className={"pause-button"} />
                :
                <img alt={""} src={process.env.PUBLIC_URL + '/images/play-button.png'} className={"play-button"} />
                }
            </div>
            :
            <></>
            }
            <br />
            <canvas ref={frequencyRef} id="frequency" />
            <canvas ref={backgroundRef} id="background" />
            <img alt={""} src={process.env.PUBLIC_URL + '/images/main_images/' + props.imageNumber + '.jpeg'} style={{objectFit: "cover", height: "100%", minWidth: "100%", width: "auto", position: "absolute", zIndex: "-3", top: "0px", left: "0px"}}/>
            {/* TODO: Make a nice way for users to upload their own audio files and scrub through
            <div className='bottom-controls'>
                <input ref={scrubBarRef} type="range" min="0" max="100" defaultValue={0} id="scrub-bar" disabled={!loaded} onChange={() => {updatePlayback();}}/>
                <input type="file" ref={fileInputRef} onChange={loadAudio} />
            </div>
            */}
        </div>
    );
}

export default AudioVisualizer;
