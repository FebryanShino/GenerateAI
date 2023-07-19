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
    alert('baka');
  }
  
  if(!imageStatus) {
    alert('BRUH');
    return;
  }


  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Prodia-Key': API_KEY
    },
    body: JSON.stringify({
      upscale: upscale,
      seed: parseInt(seed),
      imageUrl: imageUrl,
      model: models[model],
      prompt: prompt,
      denoising_strength: parseFloat(denoising),
      negative_prompt: negativePrompt,
      steps: parseInt(step),
      cfg_scale: parseInt(cfg),
      sampler: sampler
    })
  };
  
  fetch('https://api.prodia.com/v1/transform', options)
    .then(response => response.json())
    .then(data => {
      const info = document.querySelector('.result > .info').children;
      const jobIDText = info[0].lastElementChild;
      const dateText = info[1].lastElementChild;
      
      jobID = data.job;
      jobIDText.textContent = data.job;
      dateText.textContent = `${day}, ${date}/${month}/${year}`;
    })
    .catch(err => console.error(err));
});