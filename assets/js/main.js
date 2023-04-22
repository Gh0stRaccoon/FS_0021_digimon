const getDigimons = async () => {
	try {
		const digimons = await fetch(
			'https://www.digi-api.com/api/v1/digimon?pageSize=20'
		).then((res) => res.json());
		drawDigimons(digimons.content);
	} catch (error) {
		console.error(error);
	}
};

const getDigimon = async (digimonName) => {
	try {
		const digimon = await fetch(
			`https://www.digi-api.com/api/v1/digimon/${digimonName}`
		).then((res) => res.json());
		return digimon;
	} catch (error) {
		console.error(error);
	}
};

const showIndividual = async (e) => {
	const digimonName = e.currentTarget.dataset.digimonName;
	const digimonInfo = await getDigimon(digimonName);
	console.log(digimonInfo);

	const dialog = document.createElement('dialog');

	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'x';
	closeBtn.addEventListener('click', () => dialog.remove());

	const digimonImage = document.createElement('img');
	digimonImage.src = digimonInfo.images[0]?.href;

	dialog.innerHTML += `
  <div class="dialog-container">
  <img src="${digimonInfo.images[0]?.href}" alt="${digimonInfo.name}"/>
  <div class="dialog-digimon-info">
  <h2>${digimonInfo.name}</h2>
  ${digimonInfo.levels
		.map((level) => `<span class="digimon-level">${level.level}</span>`)
		.join('')}
    <div class="digimon-fields">
    ${digimonInfo.fields
			.map(
				(field) =>
					`<img src="https://digimon-api.com/images/etc/fields/${field.field}.png" />`
			)
			.join('')}
      </div>
      <p class="digimon-description">${
				digimonInfo.descriptions?.find(
					(description) => description.language === 'en_us'
				)?.description || ''
			}</p>
        </div>
        </div>
        `;

	dialog.appendChild(closeBtn);
	document.body.appendChild(dialog);
	dialog.showModal();
};

const drawDigimons = (digimons) => {
	const digimonList = document.getElementById('digimon-list');

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
		cardImage.setAttribute('src', digimon.image);
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
