let imageStatus = false;
let jobID = null;


const imgInput = document.querySelector('.image-container > input');
const image = document.querySelector('.image-container > div > div');
const fileBruh = document.querySelector('form');
const file = document.querySelector('.file-input');


imgInput.addEventListener('input', () => {
  const imageStatusText = document.querySelector('.image-container > h6');
  const img = new Image();
  image.style.backgroundImage = `url(${imgInput.value})`;
  img.src = imgInput.value;

  imageStatus = false;
  imageStatusText.textContent = 'Try other image';
  imageStatusText.style.color = 'red';
  img.addEventListener('load', () => {
    imageStatus = true;
    imageStatusText.textContent = `You're good to go`;
    imageStatusText.style.color = 'lime';
  });
});


const advancedBtn = document.querySelector('.advanced-btn');

advancedBtn.addEventListener('click', () => {
  const advancedContent = document.querySelector('.advanced');
  const status = advancedBtn.getAttribute('data-status') === "false";

  if(status) {
    advancedContent.style.height = 'auto';
    advancedBtn.lastElementChild.textContent = 'Hide';
    advancedBtn.setAttribute('data-status', status);
  } else {
    advancedContent.style.height = 0;
    advancedBtn.lastElementChild.textContent = 'Show';
    advancedBtn.setAttribute('data-status', status);
  }
});




const updateSlider = (element, value) => {
  element.lastElementChild.textContent = value;
}

const advancedSilders = document.querySelector('.advanced').querySelectorAll('div');


for(let i = 0; i < advancedSilders.length; i++) {
  const slider = advancedSilders[i].children;

  slider[1].addEventListener('input', () => {
    updateSlider(slider[0], slider[1].value);
  });
}


fileBruh.addEventListener('submit', (event) => {
  event.preventDefault();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date();
  const day = daysOfWeek[d.getDay()];
  const date = d.getDate();
  const month = d.getMonth();
  const year = d.getYear();
  
  const API_KEY = document.querySelector('.api > input').value;
  const imageUrl = document.querySelector('.image-container > input').value;

  const prompt = document.querySelector('#prompt').value;
  const negativePrompt = document.querySelector('#negative-prompt').value;  
  const model = document.querySelector('#models').value;
  
  
  const sampler = document.querySelector('#sampler').value;
  const upscale = document.querySelector('.upscale').getAttribute('data-status') === 'true';

  const step = document.querySelector('#step').value;
  const cfg = document.querySelector('#cfg').value;
  const denoising = document.querySelector('#denoising').value;
  const seed = document.querySelector('#seed').value;

  const models = {
    'Anything V3': 'anythingv3_0-pruned.ckpt [2700c435]',
    'Anything V4.5': 'anything-v4.5-pruned.ckpt [65745d25]',
    'AbyssOrangeMix3 A3': 'AOM3A3_orangemixs.safetensors [9600da17]'
  }
  
  
  if(API_KEY === '') {
    window.scroll({
      top: '0'
    });
    alert('Please enter the API KEY');
    return
  }
  
  if(!imageStatus) {
    alert('Please enter the image url correctly');
    return;
  }
  fetch('https://portfolio.febryanshino.repl.co/api/prodia/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      API_KEY: API_KEY,
      upscale: upscale,
      seed: parseInt(seed),
      image_url: imageUrl,
      model: models[model],
      prompt: prompt,
      denoising: parseFloat(denoising),
      negative_prompt: negativePrompt,
      steps: parseInt(step),
      cfg: parseInt(cfg),
      sampler: sampler
    })
  })
    .then(response => response.json())
    .then(data => {
      const info = document.querySelector('.result > .info').children;
      const jobIDText = info[0].lastElementChild;
      const dateText = info[1].lastElementChild;
      
      jobID = data.job;
      jobIDText.textContent = data.job;
      dateText.textContent = `${day}, ${date}/${month}/${year + 1900}`;
    });
  
  
});



const getImage = document.querySelector('.result > .info > button');
const copyJobID = document.querySelector('.result-img').children[1];

copyJobID.addEventListener('click', (event) => {
  event.preventDefault();
  navigator.clipboard.writeText(jobID);
});



getImage.addEventListener('click', () => {
  const resultImg = document.querySelector('.result-img');
  const downloadBtn = resultImg.children[0];

  if(jobID === null) {
    alert('Please Generate an image first');
    return;
  }
  getImage.textContent = 'Loading';

  const temp = new Image();
  const url = `https://images.prodia.xyz/${jobID}.png`
  temp.src = url;
      
  resultImg.style.backgroundImage = `url(${url})`;
  resultImg.style.opacity = 0;
  downloadBtn.href = url;
  temp.addEventListener('load', () => {
    resultImg.style.opacity = 1;
    getImage.textContent = 'Receive Image';
  });
});
