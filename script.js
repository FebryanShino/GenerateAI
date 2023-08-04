const changeMode = (textMode) => {
  const imageContainer = document.querySelector('.image-container');
  const controlnet = document.querySelector('.controlnet');
  if (textMode) {
    imageContainer.classList.add('hidden');
    controlnet.classList.add('hidden');
  } else {
    imageContainer.classList.remove('hidden');
    controlnet.classList.remove('hidden');
  }
}


const typeToggleParent = document.querySelector('.type-toggle');

const typeToggles = typeToggleParent.children;

for (let i = 0; i < typeToggles.length; i++) {
  const button = typeToggles[i];
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const textMode = button.getAttribute('data-img') === 'false';
    typeToggleParent.setAttribute('data-status', textMode);

    changeMode(textMode);

    button.style.background = 'var(--btn-color)';
    button.style.color = 'black';


    for (let j = 0; j < typeToggles.length; j++) {
      if (typeToggles[j] !== button) {
        typeToggles[j].style.background = 'none';
        typeToggles[j].style.color = 'orange';
      }
    }
  });
}



let imageStatus = false;


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

  if (status) {
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


for (let i = 0; i < advancedSilders.length; i++) {
  const slider = advancedSilders[i].children;

  slider[1].addEventListener('input', () => {
    updateSlider(slider[0], slider[1].value);
  });
}



const retrieveImage = () => {
  const resultImg = document.querySelector('.result-img');
  const downloadBtn = resultImg.children[0];
  const jobID = document.querySelector('.info').getAttribute('data-job');

  if (jobID === '') {
    alert('Please Generate an image first');
    return;
  }
  let temp = new Image();
  let url = `https://images.prodia.xyz/${jobID}.png`;
  temp.src = url;
  getImage.textContent = 'Loading';

  // resultImg.style.opacity = 0;
  
  downloadBtn.href = url;
  temp.addEventListener('load', () => {
    resultImg.style.background = `url(${url})`;
    resultImg.style.backgroundPosition = 'center';
    resultImg.style.backgroundSize = 'cover';
    resultImg.style.opacity = 1;
    getImage.textContent = 'Receive Image';
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

  
  const textMode = document.querySelector('.type-toggle').getAttribute('data-status') === 'true';

  const API_KEY = document.querySelector('.api > input').value;

  let imageUrl = 'null';


  const prompt = document.querySelector('#prompt').value;
  const negativePrompt = document.querySelector('#negative-prompt').value;
  const model = document.querySelector('#models').value;


  const sampler = document.querySelector('#sampler').value;
  const upscale = document.querySelector('.upscale').getAttribute('data-status') === 'true';

  const step = document.querySelector('#step').value;
  const cfg = document.querySelector('#cfg').value;
  const denoising = document.querySelector('#denoising').value;
  const seed = document.querySelector('#seed').value;

  const controlnet = document.querySelector('#controlnet').value;


  



  if (API_KEY === '') {
    window.scroll({
      top: '0'
    });
    alert('Please enter the API KEY');
    return
  }

  if (!imageStatus && textMode !== true) {
    
    alert('Please enter the image url correctly');
    return;
  }
  if (!textMode) {
    imageUrl = document.querySelector('.image-container > input').value;
  }
  let params = {
    data: [
      API_KEY,
      prompt,
      negativePrompt,
      model,
      sampler,
      parseInt(denoising),
      parseInt(step),
      parseInt(cfg),
      upscale,
      'landscape',
      parseInt(seed),
      imageUrl,
      controlnet
    ]
  }
  
  fetch('https://febryans-prodiaapi.hf.space/run/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
    .then(response => response.json())
    .then(data => {
      let job = data.data[0];
      
      const info = document.querySelector('.result > .info').children;
      const jobIDText = info[0].lastElementChild;
      const dateText = info[1].lastElementChild;
      document.querySelector('.info')
        .setAttribute('data-job', job);
      jobIDText.textContent = job;
      dateText.textContent = `${day}, ${date}/${month}/${year + 1900}`;
    });
});


const getImage = document.querySelector('.result > .info > button');
const copyJobID = document.querySelector('.result-img').children[1];

copyJobID.addEventListener('click', (event) => {
  event.preventDefault();
  const jobID = document.querySelector('.info').getAttribute('data-job');
  navigator.clipboard.writeText(jobID);
});



getImage.addEventListener('click', () => {
  retrieveImage();
});
