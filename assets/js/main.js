let allDigimons = [];
let timer;
let matchDigimons = [];

const handleSearch = (event) => {
	event.preventDefault();

	clearTimeout(timer);

	timer = setTimeout(() => {
		if (event.target.value === '') {
			drawDigimons(allDigimons);
			return;
		}

		matchDigimons = allDigimons.filter((digimon) =>
			digimon.name.toLowerCase().includes(event.target.value.toLowerCase())
		);

		drawDigimons(matchDigimons);
	}, 500);
};

const search = document.getElementById('search');
search.addEventListener('input', handleSearch);
search.addEventListener('submit', handleSearch);

const getDigimons = async () => {
	try {
		const digimons = await fetch(
			'https://digimon-api.vercel.app/api/digimon'
		).then((res) => res.json());
		allDigimons = digimons;
		drawDigimons(allDigimons);
	} catch (error) {
		console.error(error);
	}
};

const getDigimon = async (digimonName) => {
	try {
		const digimon = await fetch(
			`https://digimon-api.vercel.app/api/digimon/name/${digimonName}`
		).then((res) => res.json());
		return digimon[0];
	} catch (error) {
		console.error(error);
	}
};

const showIndividual = async (e) => {
	const digimonName = e.currentTarget.dataset.digimonName;
	const digimonInfo = await getDigimon(digimonName);

	const dialog = document.createElement('dialog');
	dialog.addEventListener('keydown', (e) => {
		e.preventDefault();
		e.code === 'Escape' && dialog.remove();
	});

	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'x';
	closeBtn.addEventListener('click', () => dialog.remove());

	dialog.innerHTML += `
  <div class="dialog-container">
  	<img src="${digimonInfo.img}" alt="${digimonInfo.name}"/>
  	<div class="dialog-digimon-info">
  		<h2>${digimonInfo.name}</h2>
			<span class="digimon-level">${digimonInfo.level}</span>
		</div>
	</div>
        `;

	dialog.appendChild(closeBtn);
	document.body.appendChild(dialog);
	dialog.showModal();
};

const drawDigimons = (digimons) => {
	const digimonList = document.getElementById('digimon-list');
	digimonList.innerHTML = '';

	if (!digimons.length) {
		digimonList.innerHTML =
			'<h2 style="grid-area: none">No hay digimons que coincidan...</h2>';
		return;
	}

	const imageLoaded = (digimonCard) => {
		digimonCard.classList.remove('loading');
	};

	digimons.forEach((digimon) => {
		const digimonCard = document.createElement('article');
		digimonCard.classList.add('digimon-card');
		digimonCard.classList.add('loading');
		digimonCard.setAttribute('data-digimon-name', digimon.name);
		digimonCard.addEventListener('click', showIndividual);

		const cardHeader = document.createElement('header');

		const cardImage = document.createElement('img');
		cardImage.addEventListener('load', () => imageLoaded(digimonCard));
		cardImage.classList.add('digimon-img');
		cardImage.setAttribute('src', digimon.img);
		cardImage.setAttribute('alt', digimon.name);

		const cardTitle = document.createElement('h2');
		cardTitle.textContent = digimon.name;
		cardTitle.classList.add('digimon-name');

		cardHeader.appendChild(cardImage);
		cardHeader.appendChild(cardTitle);

		digimonCard.appendChild(cardHeader);

		digimonList.appendChild(digimonCard);
	});
};

getDigimons();
